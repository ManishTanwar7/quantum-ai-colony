from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    role = user_data.role if user_data.role in [r.value for r in UserRole] else UserRole.STUDENT.value
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hash_password(user_data.password),
        role=role,
        avatar="qubit-bot"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials"
        )
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/demo-login/{role}", response_model=TokenResponse)
def demo_login(role: str, db: Session = Depends(get_db)):
    email_map = {
        "student": "student@quantumcolony.io",
        "instructor": "instructor@quantumcolony.io",
        "admin": "admin@quantumcolony.io"
    }
    email = email_map.get(role.lower())
    if not email:
        raise HTTPException(status_code=400, detail="Invalid demo role requested")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create on the fly if not seeded yet
        user = User(
            email=email,
            name=f"{role.capitalize()} Demo User",
            hashed_password=hash_password("quantum123"),
            role=role.lower(),
            avatar="atom" if role == "instructor" else "qubit-bot"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)
