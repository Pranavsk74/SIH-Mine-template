export interface MissionReport {
  id: string;
  timestamp: string;
  missionId: string;
  rover: string;
  location: string;
  status: string;
  riskScore: number;
  primaryHazard: string;
  workersDetected: number;
  sensors: Record<string, string>;
  ai: Record<string, string>;
  missionState: string;
  summary: string;
  recommendation: string;
}

export interface GenerateReportPayload {
  missionId?: string;
  rover?: string;
  location?: string;
  status?: string;
  riskScore?: number;
  primaryHazard?: string;
  workersDetected?: number;
  sensors?: Record<string, string>;
  ai?: Record<string, string>;
  workerData?: Record<string, any>;
  missionState?: string;
}
