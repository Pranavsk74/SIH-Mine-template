from fastapi import APIRouter

router = APIRouter(prefix="/api/mission", tags=["mission"])

mission_state = {
    "state": "STANDBY",
    "roverName": "MINE SENSE ROVER 01",
    "battery": 94,
    "signal": 98,
    "connection": "LTE / RF MESH",
    "ch4": 1.8,
    "co": 34.2,
    "temperature": 32.4,
    "currentTunnel": "JUNCTION B-04",
    "activeAlerts": [
        "Elevated CO detected in Tunnel B-04",
        "Thermal signature verified at 37m"
    ],
    "aiModules": {
        "sensorAi": True,
        "visionAi": True,
        "featureFusion": True,
        "riskClassifier": True
    }
}

@router.get("/status")
def get_mission_status():
    return mission_state

@router.post("/start")
def start_mission():
    mission_state["state"] = "ACTIVE"
    return mission_state

@router.post("/pause")
def pause_mission():
    mission_state["state"] = "PAUSED"
    return mission_state

@router.post("/return")
def return_to_base():
    mission_state["state"] = "RETURNING"
    return mission_state
