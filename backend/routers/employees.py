from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db, Employee
from models import EmployeeCreate, EmployeeResponse

router = APIRouter()


@router.post(
    "/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED
)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    """Add a new employee"""
    employee = Employee(
        employee_id=payload.employee_id,
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department,
    )
    try:
        db.add(employee)
        db.commit()
        db.refresh(employee)
    except IntegrityError as exc:
        db.rollback()
        error_msg = str(exc.orig).lower()
        if "email" in error_msg or "employees.email" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{payload.email}' is already registered.",
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with ID '{payload.employee_id}' already exists.",
        )
    return employee


@router.get("/employees", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    """Retrieve all employees"""
    return db.query(Employee).order_by(Employee.created_at.desc()).all()


@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve a single employee by ID"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )
    return employee


@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete an employee and cascade-delete their attendance records"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )
    db.delete(employee)
    db.commit()
    return {"message": f"Employee '{employee_id}' deleted successfully."}
