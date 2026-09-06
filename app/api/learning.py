import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.database import get_db
from app.models.user import User
from app.models.progress import LessonProgress, ChallengeSubmission
from app.schemas.learning import (
    Lesson,
    QuizSubmission,
    Challenge,
    ChallengeSubmitRequest,
    ChallengeResult
)
from app.services.auth_service import get_current_user
from app.services.grader_service import QuantumGraderService
from app.seed_data import SAMPLE_LESSONS, SAMPLE_CHALLENGES

router = APIRouter(prefix="/learning", tags=["Interactive Learning"])

@router.get("/lessons", response_model=List[Lesson])
def get_lessons():
    return [Lesson(**l) for l in SAMPLE_LESSONS]

@router.get("/lessons/{lesson_id}", response_model=Lesson)
def get_lesson(lesson_id: str):
    for l in SAMPLE_LESSONS:
        if l["id"] == lesson_id:
            return Lesson(**l)
    raise HTTPException(status_code=404, detail="Lesson not found")

@router.post("/quiz-submit")
def submit_quiz(
    sub: QuizSubmission,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson = next((l for l in SAMPLE_LESSONS if l["id"] == sub.lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    correct_count = 0
    total = len(lesson["quiz"])
    for q in lesson["quiz"]:
        q_id = q["id"]
        if q_id in sub.answers and sub.answers[q_id] == q["correct_index"]:
            correct_count += 1

    score_pct = int((correct_count / max(1, total)) * 100)
    passed = score_pct >= 50

    # Record or update progress in DB
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == user.id,
        LessonProgress.lesson_id == sub.lesson_id
    ).first()

    if not progress:
        progress = LessonProgress(
            user_id=user.id,
            lesson_id=sub.lesson_id,
            completed=passed,
            quiz_score=score_pct
        )
        db.add(progress)
    else:
        progress.quiz_score = max(progress.quiz_score, score_pct)
        if passed:
            progress.completed = True
    db.commit()

    return {
        "score_pct": score_pct,
        "correct_count": correct_count,
        "total_questions": total,
        "passed": passed
    }

@router.get("/challenges", response_model=List[Challenge])
def get_challenges():
    return [Challenge(**c) for c in SAMPLE_CHALLENGES]

@router.get("/challenges/{challenge_id}", response_model=Challenge)
def get_challenge(challenge_id: str):
    for c in SAMPLE_CHALLENGES:
        if c["id"] == challenge_id:
            return Challenge(**c)
    raise HTTPException(status_code=404, detail="Challenge not found")

@router.post("/submit-challenge", response_model=ChallengeResult)
def submit_challenge(
    req: ChallengeSubmitRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    challenge = next((c for c in SAMPLE_CHALLENGES if c["id"] == req.challenge_id), None)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Run auto-grader
    result = QuantumGraderService.grade_challenge(
        challenge_id=challenge["id"],
        expected_probabilities=challenge["expected_probabilities"],
        max_gates=challenge.get("max_gates", 10),
        circuit_data=req.circuit,
        qiskit_code=req.qiskit_code
    )

    # Record submission
    try:
        submission = ChallengeSubmission(
            user_id=user.id,
            challenge_id=challenge["id"],
            code=req.qiskit_code,
            circuit_json=json.dumps(req.circuit) if req.circuit else None,
            passed=result["passed"],
            fidelity=result["fidelity"],
            feedback=result["feedback"]
        )
        db.add(submission)
        db.commit()
    except Exception:
        pass

    return ChallengeResult(**result)

@router.get("/my-progress")
def get_my_progress(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson_progresses = db.query(LessonProgress).filter(LessonProgress.user_id == user.id).all()
    submissions = db.query(ChallengeSubmission).filter(ChallengeSubmission.user_id == user.id).all()

    completed_lessons = [lp.lesson_id for lp in lesson_progresses if lp.completed]
    passed_challenges = list(set([cs.challenge_id for cs in submissions if cs.passed]))

    return {
        "completed_lessons": completed_lessons,
        "passed_challenges": passed_challenges,
        "total_lessons": len(SAMPLE_LESSONS),
        "total_challenges": len(SAMPLE_CHALLENGES),
        "lesson_progress_records": [
            {"lesson_id": lp.lesson_id, "completed": lp.completed, "score": lp.quiz_score}
            for lp in lesson_progresses
        ]
    }
