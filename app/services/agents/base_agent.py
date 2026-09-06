from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import uuid
import datetime

class BaseAgent(ABC):
    def __init__(self, agent_id: str, name: str, role: str, avatar: str, color: str, station: str):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.avatar = avatar
        self.color = color
        self.station = station

    def create_message(
        self,
        content: str,
        circuit_snippet: Optional[str] = None,
        bloch_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        return {
            "id": f"msg-{uuid.uuid4().hex[:8]}",
            "agent": self.agent_id,
            "agent_name": self.name,
            "role": self.role,
            "avatar": self.avatar,
            "color": self.color,
            "station": self.station,
            "content": content,
            "circuit_snippet": circuit_snippet,
            "bloch_data": bloch_data,
            "timestamp": datetime.datetime.utcnow().strftime("%H:%M:%S")
        }

    @abstractmethod
    def process_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the task given prior context from previous agents.
        Returns the agent message dictionary.
        """
        pass
