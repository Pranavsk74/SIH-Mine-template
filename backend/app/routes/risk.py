from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/risk", tags=["risk"])

current_risk = {
    "score": 67,
    "level": "HIGH",
    "alert": "FLAMMABLE METHANE TRACE + ELEVATED TEMPERATURE IN TUNNEL B-04"
}

class RiskSimulateRequest(BaseModel):
    level: str

@router.get("")
def get_risk():
    return current_risk

@router.post("/simulate")
def simulate_risk(req: RiskSimulateRequest):
    level = req.level.upper()
    if level == "LOW":
        current_risk["score"] = 18
        current_risk["level"] = "LOW"
        current_risk["alert"] = "ALL ATMOSPHERIC CHANNELS SAFE. STABLE AIRFLOW."
    elif level == "MODERATE":
        current_risk["score"] = 42
        current_risk["level"] = "MODERATE"
        current_risk["alert"] = "ELEVATED CO DRIFT DETECTED IN SECTOR C-02."
    elif level == "HIGH":
        current_risk["score"] = 67
        current_risk["level"] = "HIGH"
        current_risk["alert"] = "FLAMMABLE METHANE TRACE + ELEVATED TEMPERATURE IN TUNNEL B-04."
    elif level == "CRITICAL":
        current_risk["score"] = 94
        current_risk["level"] = "CRITICAL"
        current_risk["alert"] = "CRITICAL: EXPONENTIAL CH4 RISE + SEISMIC STRATA DISPLACEMENT!"
    return current_risk
