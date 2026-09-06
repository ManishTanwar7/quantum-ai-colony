import asyncio
import json
import logging
from typing import List, Dict, Any, Set
from fastapi import WebSocket
from app.services.agents import (
    ProfessorAgent,
    EngineerAgent,
    DebuggerAgent,
    OptimizerAgent,
    VisualizerAgent
)

logger = logging.getLogger("colony_bus")

class ColonyBus:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.messages_history: List[Dict[str, Any]] = []
        self.active_mission: Optional[str] = None
        self.agents = {
            "professor": ProfessorAgent(),
            "engineer": EngineerAgent(),
            "debugger": DebuggerAgent(),
            "optimizer": OptimizerAgent(),
            "visualizer": VisualizerAgent()
        }

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Total clients: {len(self.active_connections)}")
        # Send colony state to newly connected client
        await websocket.send_json({
            "type": "colony_init",
            "active_mission": self.active_mission,
            "messages": self.messages_history[-30:],  # last 30 messages
            "agents": [
                {
                    "id": a.agent_id,
                    "name": a.name,
                    "role": a.role,
                    "avatar": a.avatar,
                    "color": a.color,
                    "station": a.station
                }
                for a in self.agents.values()
            ]
        })

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcasts payload to all connected frontend clients."""
        dead_connections = set()
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception as e:
                logger.warning(f"Error broadcasting to client: {e}")
                dead_connections.add(conn)
        for dead in dead_connections:
            self.active_connections.discard(dead)

    async def run_colony_pipeline(self, prompt: str, mission_id: str, title: str) -> Dict[str, Any]:
        """
        Executes the multi-agent colony collaboration pipeline.
        Each agent processes the task in sequence, broadcasts movements on the railway track,
        and posts messages.
        """
        self.active_mission = title
        context: Dict[str, Any] = {"prompt": prompt, "mission_id": mission_id, "title": title}
        mission_messages: List[Dict[str, Any]] = []

        # Broadcast mission started
        await self.broadcast({
            "type": "mission_started",
            "mission_id": mission_id,
            "title": title,
            "prompt": prompt
        })

        agent_sequence = [
            ("professor", "theory"),
            ("engineer", "foundry"),
            ("debugger", "debug"),
            ("optimizer", "optimizer"),
            ("visualizer", "visualizer")
        ]

        for agent_key, station in agent_sequence:
            agent = self.agents[agent_key]

            # 1. Broadcast agent movement on railway track
            await self.broadcast({
                "type": "agent_moving",
                "agent_id": agent.agent_id,
                "station": station,
                "status": f"{agent.name} arriving at {station.capitalize()} Station..."
            })
            await asyncio.sleep(0.8)

            # 2. Agent is processing / thinking
            await self.broadcast({
                "type": "agent_thinking",
                "agent_id": agent.agent_id,
                "station": station
            })
            await asyncio.sleep(1.0)

            # 3. Agent produces message & updates context
            msg = agent.process_task(prompt, context)
            self.messages_history.append(msg)
            mission_messages.append(msg)

            # 4. Broadcast agent dialogue message
            await self.broadcast({
                "type": "agent_message",
                "message": msg,
                "station": station
            })
            await asyncio.sleep(0.8)

        # Broadcast mission completion with final circuit & state
        final_summary = (
            f"Colony Consensus Reached: Successfully developed, audited, optimized, and mapped quantum state for '{title}'."
        )

        result_payload = {
            "mission_id": mission_id,
            "title": title,
            "prompt": prompt,
            "messages": mission_messages,
            "final_circuit": {
                "num_qubits": context.get("num_qubits", 2),
                "gates": context.get("gates", [])
            },
            "qiskit_code": context.get("qiskit_code", ""),
            "simulation_result": context.get("simulation_result"),
            "summary": final_summary
        }

        await self.broadcast({
            "type": "mission_completed",
            "data": result_payload
        })

        return result_payload

colony_bus = ColonyBus()
