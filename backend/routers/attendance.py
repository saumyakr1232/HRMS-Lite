from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db, Employee, Attendance
from models import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceSummary,
    DashboardResponse,
)

router = APIRouter()


@router.post(
    "/attendance",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendence for an employee on a given date"""
    # Verify employee exists
    employee = (
        db.query(Employee).filter(Employee.employee_id == payload.employee_id).first()
    )
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{payload.employee_id}' not found",
        )

    record = Attendance(
        employee_id=payload.employee_id,
        date=payload.date,
        status=payload.status.value,
    )
    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for '{payload.employee_id}' on {payload.date}.",
        )
    return record


@router.get("/attendance/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(
    employee_id: str,
    date_filter: Optional[date] = Query(
        None, alias="date", description="Filter by specific date"
    ),
    db: Session = Depends(get_db),
):
    """Retrieve attendance records for an employee, optionally filtered by date"""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )

    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if date_filter:
        query = query.filter(Attendance.date == date_filter)

    return query.order_by(Attendance.date.desc()).all()


@router.get("/attendance/{employee_id}/summary", response_model=AttendanceSummary)
def get_attendance_summary(employee_id: str, db: Session = Depends(get_db)):
    """Get present/asbent totals for an employee."""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found",
        )

    total_present = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.employee_id == employee_id, Attendance.status == "Present")
        .scalar()
    )
    total_absent = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.employee_id == employee_id, Attendance.status == "Absent")
        .scalar()
    )

    return AttendanceSummary(
        employee_id=employee_id,
        full_name=employee.full_name,
        total_present=total_present,
        total_absent=total_absent,
    )


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Return dashboard summary statistics."""
    today = date.today()

    total_employees = db.query(func.count(Employee.employee_id)).scalar()
    total_departments = db.query(
        func.count(func.distinct(Employee.department))
    ).scalar()

    present_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Present")
        .scalar()
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Absent")
        .scalar()
    )

    return DashboardResponse(
        total_employees=total_employees,
        total_departments=total_departments,
        present_today=present_today,
        absent_today=absent_today,
    )
