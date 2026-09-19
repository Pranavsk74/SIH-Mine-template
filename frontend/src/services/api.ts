import {
  FALLBACK_SENSORS,
  FALLBACK_VISION_MODES,
  FALLBACK_WORKERS,
  FALLBACK_MISSION
} from '../data/fallbackData';
import type {
  SensorMetric,
  VisionMode,
  WorkerData,
  MissionStatus
} from '../data/fallbackData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let isBackendAvailable = true;

async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  if (!isBackendAvailable) return fallback;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      signal: AbortSignal.timeout(2000)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    isBackendAvailable = true;
    return data as T;
  } catch (err) {
    console.warn(`Backend endpoint ${endpoint} unreachable, using demo fallback data.`, err);
    isBackendAvailable = false;
    return fallback;
  }
}

export async function getSensors(): Promise<Record<string, SensorMetric>> {
  return fetchWithFallback<Record<string, SensorMetric>>('/api/sensors', FALLBACK_SENSORS);
}

export async function getVisionModes(): Promise<VisionMode[]> {
  return fetchWithFallback<VisionMode[]>('/api/vision/modes', FALLBACK_VISION_MODES);
}

export async function getWorkers(): Promise<WorkerData[]> {
  return fetchWithFallback<WorkerData[]>('/api/workers', FALLBACK_WORKERS);
}

export async function getMissionStatus(): Promise<MissionStatus> {
  return fetchWithFallback<MissionStatus>('/api/mission/status', FALLBACK_MISSION);
}

export async function startMission(): Promise<MissionStatus> {
  if (!isBackendAvailable) {
    return { ...FALLBACK_MISSION, state: 'ACTIVE' };
  }
  try {
    const res = await fetch(`${BASE_URL}/api/mission/start`, { method: 'POST' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { ...FALLBACK_MISSION, state: 'ACTIVE' };
  }
}

export async function pauseMission(): Promise<MissionStatus> {
  if (!isBackendAvailable) {
    return { ...FALLBACK_MISSION, state: 'PAUSED' };
  }
  try {
    const res = await fetch(`${BASE_URL}/api/mission/pause`, { method: 'POST' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { ...FALLBACK_MISSION, state: 'PAUSED' };
  }
}

export async function returnToBase(): Promise<MissionStatus> {
  if (!isBackendAvailable) {
    return { ...FALLBACK_MISSION, state: 'RETURNING' };
  }
  try {
    const res = await fetch(`${BASE_URL}/api/mission/return`, { method: 'POST' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { ...FALLBACK_MISSION, state: 'RETURNING' };
  }
}

export async function getRiskScore(): Promise<{ score: number; level: string; alert: string }> {
  return fetchWithFallback<{ score: number; level: string; alert: string }>('/api/risk', {
    score: 67,
    level: 'HIGH',
    alert: 'FLAMMABLE METHANE TRACE + ELEVATED TEMPERATURE IN TUNNEL B-04'
  });
}

export async function generateReport(payload: any): Promise<any> {
  const fallbackReport = {
    id: `MINE-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    missionId: payload.missionId || 'MINE-04',
    rover: payload.rover || 'MINE SENSE ROVER-01',
    location: payload.location || 'TUNNEL B-04',
    status: payload.status || 'HIGH',
    riskScore: payload.riskScore !== undefined ? payload.riskScore : 67,
    primaryHazard: payload.primaryHazard || 'Methane Anomaly & Elevated CO',
    workersDetected: payload.workersDetected !== undefined ? payload.workersDetected : 1,
    sensors: payload.sensors || {
      "CH4": "1.8 %",
      "CO": "34.2 PPM",
      "Temperature": "32.4 °C",
      "Humidity": "78.5 %",
      "Vibration": "0.14 g"
    },
    ai: payload.ai || {
      "sensorModel": "LSTM Temporal Net",
      "visionModel": "YOLO v8 Thermal Perception",
      "fusion": "Multimodal Vector Fusion",
      "classifier": "MLP Classifier"
    },
    missionState: payload.missionState || 'ACTIVE',
    summary: 'Autonomous rover completed initial shaft scanning in Tunnel B-04. Elevated CH4 and CO concentrations verified. Multimodal thermal LWIR vision confirmed 1 trapped miner at 37m distance.',
    recommendation: 'Proceed with remote environmental stabilization before human entry. Maintain sub-GHz RF mesh link and continuous gas sampling.'
  };

  try {
    const res = await fetch(`${BASE_URL}/api/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return fallbackReport;
  }
}

export async function getReports(): Promise<any[]> {
  return fetchWithFallback<any[]>('/api/reports', []);
}

export function getReportPdfUrl(reportId: string): string {
  return `${BASE_URL}/api/reports/${reportId}/pdf`;
}

