from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AgentMessage(BaseModel):
    id: str
    agent: str         # "professor", "engineer", "debugger", "optimizer", "visualizer"
    agent_name: str    # e.g., "Prof. Evelyn Vance"
    role: str          # e.g., "Theory Specialist"
    avatar: str        # e.g., "atom", "cpu", "bug", "zap", "eye"
    color: str         # Hex or Tailwind color string
    station: str       # "theory", "foundry", "debug", "optimizer", "visualizer"
    content: str
    circuit_snippet: Optional[str] = None
    bloch_data: Optional[Dict[str, Any]] = None
    timestamp: str

class MissionRequest(BaseModel):
    mission_id: Optional[str] = None
    title: str
    prompt: str
    num_qubits: Optional[int] = 2

class MissionResponse(BaseModel):
    mission_id: str
    title: str
    prompt: str
    messages: List[AgentMessage]
    final_circuit: Optional[Dict[str, Any]] = None
    qiskit_code: Optional[str] = None
    summary: str

class ColonyStatus(BaseModel):
    agents: List[Dict[str, Any]]
    active_mission: Optional[str] = None
    bus_connected_clients: int = 0
