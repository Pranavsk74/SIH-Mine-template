from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter(prefix="/api/workers", tags=["workers"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "workers.json")

@router.get("")
def get_workers():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/{worker_id}")
def get_worker(worker_id: str):
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        workers = json.load(f)
        for w in workers:
            if w["id"] == worker_id:
                return w
        raise HTTPException(status_code=404, detail="Worker not found")
