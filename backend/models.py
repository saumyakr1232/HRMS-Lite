from __future__ import annotations

import datetime as dt
from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    employee_id: str = Field(
        ...,
        min_length=1,
        max_length=20,
        pattern=r"^[A-Za-z0-9_-]+$",
        description="Unique employee identifier (alphanumeric, dash, underscore)",
        examples=["EMP001"],
    )
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-z\s''\-]+$",
        description="Employee full name (letters, spaces, hyphens, apostrophes only)",
        examples=["John Doe"],
    )
    email: EmailStr = Field(..., examples=["john.doe@company.com"])
    department: str = Field(..., min_length=1, max_length=50, examples=["Engineering"])


class EmployeeResponse(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: dt.datetime

    class Config:
        from_attributes = True


class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, examples=["EMP001"])
    date: dt.date = Field(..., examples=["2026-03-09"])
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: dt.date
    status: str
    created_at: dt.datetime

    class Config:
        from_attributes = True


class AttendanceSummary(BaseModel):
    employee_id: str
    full_name: str
    total_present: int
    total_absent: int


class DashboardResponse(BaseModel):
    total_employees: int
    total_departments: int
    present_today: int
    absent_today: int
