import uuid
import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.schemas.colony import MissionRequest, MissionResponse, AgentMessage, ColonyStatus
from app.services.colony_bus import colony_bus
from app.seed_data import SAMPLE_MISSIONS
from app.models.mission import MissionLog

router = APIRouter(prefix="/colony", tags=["AI Colony"])

@router.websocket("/ws")
async def websocket_colony_endpoint(websocket: WebSocket):
    await colony_bus.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle client-initiated ping or task assignment
            try:
                payload = json.loads(data)
                if payload.get("type") == "trigger_mission":
                    prompt = payload.get("prompt", "Analyze quantum state")
                    title = payload.get("title", "Ad-hoc User Directive")
                    mission_id = payload.get("mission_id", f"m-{uuid.uuid4().hex[:6]}")
                    asyncio.create_task(colony_bus.run_colony_pipeline(prompt, mission_id, title))
            except Exception:
                pass
    except WebSocketDisconnect:
        colony_bus.disconnect(websocket)
    except Exception:
        colony_bus.disconnect(websocket)

@router.post("/missions", response_model=MissionResponse)
async def dispatch_mission(
    req: MissionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    mission_id = req.mission_id or f"mission-{uuid.uuid4().hex[:6]}"
    
    # Run the colony pipeline
    result = await colony_bus.run_colony_pipeline(req.prompt, mission_id, req.title)

    # Save mission log to database
    try:
        ml = MissionLog(
            mission_id=mission_id,
            title=req.title,
            prompt=req.prompt,
            colony_summary=result["summary"],
            consensus_circuit=json.dumps(result.get("final_circuit"))
        )
        db.add(ml)
        db.commit()
    except Exception:
        pass

    return MissionResponse(
        mission_id=mission_id,
        title=req.title,
        prompt=req.prompt,
        messages=[AgentMessage(**m) for m in result["messages"]],
        final_circuit=result.get("final_circuit"),
        qiskit_code=result.get("qiskit_code"),
        summary=result["summary"]
    )

@router.get("/status", response_model=ColonyStatus)
def get_colony_status():
    agents_info = [
        {
            "id": a.agent_id,
            "name": a.name,
            "role": a.role,
            "avatar": a.avatar,
            "color": a.color,
            "station": a.station
        }
        for a in colony_bus.agents.values()
    ]
    return ColonyStatus(
        agents=agents_info,
        active_mission=colony_bus.active_mission,
        bus_connected_clients=len(colony_bus.active_connections)
    )

@router.get("/messages", response_model=List[AgentMessage])
def get_colony_messages():
    return [AgentMessage(**m) for m in colony_bus.messages_history[-50:]]

@router.get("/presets")
def get_mission_presets():
    return SAMPLE_MISSIONS
