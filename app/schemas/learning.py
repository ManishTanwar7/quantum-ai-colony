from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_index: int
    explanation: str

class Lesson(BaseModel):
    id: str
    order: int
    title: str
    category: str
    description: str
    content_markdown: str
    theory_cards: List[Dict[str, str]]
    quiz: List[QuizQuestion]

class QuizSubmission(BaseModel):
    lesson_id: str
    answers: Dict[str, int] # {question_id: selected_index}

class Challenge(BaseModel):
    id: str
    title: str
    difficulty: str # "Beginner", "Intermediate", "Advanced"
    description: str
    prompt: str
    target_state: str
    expected_probabilities: Dict[str, float]
    max_qubits: int
    max_gates: Optional[int] = 10
    starter_code: str
    starter_circuit: Optional[List[Dict[str, Any]]] = None

class ChallengeSubmitRequest(BaseModel):
    challenge_id: str
    circuit: Optional[Dict[str, Any]] = None # {num_qubits: int, gates: [...]}
    qiskit_code: Optional[str] = None

class ChallengeResult(BaseModel):
    passed: bool
    fidelity: float
    message: str
    feedback: str
    actual_probabilities: Dict[str, float]
    expected_probabilities: Dict[str, float]
