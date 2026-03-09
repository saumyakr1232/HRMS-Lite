import datetime as dt
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_tables
from routers import employees, attendance


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    create_tables()
    yield


app = FastAPI(
    title="HRMS Lite",
    description="Lightweight Human Resource Management System API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api", tags=["Employees"])
app.include_router(attendance.router, prefix="/api", tags=["Attendance"])


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "HRMS Lite", "timestamp": dt.datetime.now()}
