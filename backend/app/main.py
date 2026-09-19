from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sensors, vision, workers, mission, risk, reports

app = FastAPI(
    title="MINE SENSE API",
    description="Backend REST API for MINE SENSE Autonomous Rescue Rover",
    version="1.0.0"
)

# Configure CORS for Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sensors.router)
app.include_router(vision.router)
app.include_router(workers.router)
app.include_router(mission.router)
app.include_router(risk.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "MINE SENSE API",
        "version": "1.0.0",
        "docs": "/docs"
    }
