import os
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine,
    Column,
    String,
    Integer,
    Enum,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://hrms_user:hrms_pass@localhost:5432/hrms_lite"
)

# Render uses postgres:// but SQL Alchemy requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String(20), primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    department = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(
        String(20),
        ForeignKey("employees.employee_id", ondelete="CASCADE"),
        nullable=False,
    )
    date = Column(Date, nullable=False)
    status = Column(
        Enum("Present", "Absent", name="attendance_status", create_constraint=True),
        nullable=False,
    )
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="unique_attendance"),
    )


def create_tables():
    """Create all tables in the database."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        # Handle race condition where multiple workers try
        pass


def get_db():
    """Dependency that yields a database session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
