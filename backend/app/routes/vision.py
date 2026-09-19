from fastapi import APIRouter
import json
import os

router = APIRouter(prefix="/api/vision", tags=["vision"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "vision.json")

@router.get("/modes")
def get_vision_modes():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/detections")
def get_detections(mode: str = "thermal"):
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        modes = json.load(f)
        for m in modes:
            if m["id"] == mode:
                return m["detections"]
        return modes[0]["detections"]
