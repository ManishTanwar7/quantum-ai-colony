from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.user import User, UserRole
from app.models.progress import LessonProgress, ChallengeSubmission
from app.models.circuit import SavedCircuit
from app.models.mission import MissionLog
from app.services.auth_service import require_role
from app.seed_data import SAMPLE_LESSONS, SAMPLE_CHALLENGES

router = APIRouter(prefix="/instructor", tags=["Instructor Analytics"])

@router.get("/analytics")
def get_analytics(
    user: User = Depends(require_role([UserRole.INSTRUCTOR.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == UserRole.STUDENT.value).count()
    total_submissions = db.query(ChallengeSubmission).count()
    passed_submissions = db.query(ChallengeSubmission).filter(ChallengeSubmission.passed == True).count()
    total_circuits = db.query(SavedCircuit).count()
    total_missions = db.query(MissionLog).count()

    # Pass rate
    pass_rate = round((passed_submissions / max(1, total_submissions)) * 100, 1)

    # Challenge breakdown
    challenge_stats = []
    for c in SAMPLE_CHALLENGES:
        c_subs = db.query(ChallengeSubmission).filter(ChallengeSubmission.challenge_id == c["id"]).count()
        c_passed = db.query(ChallengeSubmission).filter(
            ChallengeSubmission.challenge_id == c["id"],
            ChallengeSubmission.passed == True
        ).count()
        rate = round((c_passed / max(1, c_subs)) * 100, 1) if c_subs > 0 else 100.0
        challenge_stats.append({
            "id": c["id"],
            "title": c["title"],
            "difficulty": c["difficulty"],
            "submissions": c_subs,
            "passed": c_passed,
            "pass_rate": rate
        })

    return {
        "overview": {
            "total_students": max(1, total_students),
            "total_submissions": total_submissions,
            "passed_submissions": passed_submissions,
            "pass_rate": pass_rate,
            "total_circuits": total_circuits,
            "total_missions": total_missions
        },
        "challenges": challenge_stats
    }

@router.get("/students")
def get_students(
    user: User = Depends(require_role([UserRole.INSTRUCTOR.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    students = db.query(User).filter(User.role == UserRole.STUDENT.value).all()
    results = []
    for s in students:
        completed_lessons = db.query(LessonProgress).filter(
            LessonProgress.user_id == s.id,
            LessonProgress.completed == True
        ).count()
        passed_chal = db.query(ChallengeSubmission).filter(
            ChallengeSubmission.user_id == s.id,
            ChallengeSubmission.passed == True
        ).count()
        results.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "role": s.role,
            "completed_lessons": f"{completed_lessons}/{len(SAMPLE_LESSONS)}",
            "passed_challenges": f"{passed_chal}/{len(SAMPLE_CHALLENGES)}",
            "joined_at": s.created_at.strftime("%Y-%m-%d") if s.created_at else "2026-09-01"
        })
    return results

@router.get("/submissions")
def get_recent_submissions(
    user: User = Depends(require_role([UserRole.INSTRUCTOR.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    subs = db.query(ChallengeSubmission).order_by(ChallengeSubmission.created_at.desc()).limit(20).all()
    results = []
    for sub in subs:
        u = db.query(User).filter(User.id == sub.user_id).first()
        results.append({
            "id": sub.id,
            "student_name": u.name if u else "Unknown Student",
            "challenge_id": sub.challenge_id,
            "passed": sub.passed,
            "fidelity": sub.fidelity,
            "timestamp": sub.created_at.strftime("%Y-%m-%d %H:%M") if sub.created_at else "Just now"
        })
    return results
