from fastapi import APIRouter
import json
import os

router = APIRouter(prefix="/api/sensors", tags=["sensors"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sensors.json")

@router.get("")
def get_sensors():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
