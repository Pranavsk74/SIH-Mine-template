export interface SensorMetric {
  name: string;
  key: string;
  value: number;
  unit: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  history: number[];
  description: string;
}

export interface VisionDetection {
  label: string;
  confidence: number;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  color?: string;
}

export interface VisionMode {
  id: 'rgb' | 'night' | 'thermal';
  label: string;
  description: string;
  detections: VisionDetection[];
}

export interface WorkerData {
  id: string;
  name: string;
  tunnel: string;
  distance: number; // in meters
  confidence: number;
  status: 'DETECTED' | 'TRACKING' | 'RESCUE_RECOMMENDED';
  signalStrength: number;
  xPct: number;
  yPct: number;
}

export interface MissionStatus {
  state: 'STANDBY' | 'ACTIVE' | 'PAUSED' | 'RETURNING';
  roverName: string;
  battery: number;
  signal: number;
  connection: string;
  ch4: number;
  co: number;
  temperature: number;
  currentTunnel: string;
  activeAlerts: string[];
  aiModules: {
    sensorAi: boolean;
    visionAi: boolean;
    featureFusion: boolean;
    riskClassifier: boolean;
  };
}

export const FALLBACK_SENSORS: Record<string, SensorMetric> = {
  ch4: {
    name: 'CH4 Methane',
    key: 'ch4',
    value: 1.8,
    unit: '%',
    status: 'SAFE',
    history: [0.8, 1.0, 1.2, 1.5, 1.4, 1.7, 1.8],
    description: 'Explosive gas concentration within safe threshold (< 2.0%).'
  },
  co: {
    name: 'CO Carbon Monoxide',
    key: 'co',
    value: 34.2,
    unit: 'PPM',
    status: 'WARNING',
    history: [12, 15, 22, 28, 31, 33, 34.2],
    description: 'Toxic combustion byproduct elevated in Tunnel B-04.'
  },
  temperature: {
    name: 'Temperature',
    key: 'temperature',
    value: 32.4,
    unit: '°C',
    status: 'SAFE',
    history: [28, 29, 30, 31, 31.5, 32, 32.4],
    description: 'Ambient geothermal heat level in working face.'
  },
  humidity: {
    name: 'Relative Humidity',
    key: 'humidity',
    value: 78.5,
    unit: '%',
    status: 'SAFE',
    history: [70, 72, 74, 75, 76, 78, 78.5],
    description: 'Moisture content indicating stable drainage.'
  },
  vibration: {
    name: 'Seismic Vibration',
    key: 'vibration',
    value: 0.14,
    unit: 'g',
    status: 'SAFE',
    history: [0.05, 0.08, 0.11, 0.09, 0.12, 0.13, 0.14],
    description: 'Strata stability monitoring via piezoelectric accelerometer.'
  }
};

export const FALLBACK_VISION_MODES: VisionMode[] = [
  {
    id: 'rgb',
    label: 'RGB Daylight',
    description: 'High-resolution standard spectrum optical feed with HDR.',
    detections: [
      { label: 'WORKER', confidence: 91.4, x: 48, y: 29, width: 15, height: 26, color: '#65e2e5' },
      { label: 'HELMET', confidence: 87.2, x: 50, y: 30, width: 7, height: 8, color: '#ffbd32' },
      { label: 'OBSTRUCTION', confidence: 84.6, x: 68, y: 39, width: 10, height: 18, color: '#ffbd32' }
    ]
  },
  {
    id: 'night',
    label: 'Night Vision (IR)',
    description: '850nm active infrared illuminator with zero-light perception.',
    detections: [
      { label: 'WORKER 01', confidence: 94.8, x: 48, y: 29, width: 15, height: 26, color: '#65e2e5' },
      { label: 'EQUIPMENT', confidence: 89.1, x: 68, y: 39, width: 10, height: 18, color: '#ffd75a' }
    ]
  },
  {
    id: 'thermal',
    label: 'FLIR Thermal LWIR',
    description: 'Long-wave infrared body-heat detection through smoke and dust.',
    detections: [
      { label: 'HEAT SIGNATURE (WORKER)', confidence: 96.5, x: 48, y: 29, width: 15, height: 26, color: '#ef6c22' },
      { label: 'HOT PIPE OBSTRUCTION', confidence: 82.0, x: 68, y: 39, width: 10, height: 18, color: '#e34a38' }
    ]
  }
];

export const FALLBACK_WORKERS: WorkerData[] = [
  {
    id: 'worker-01',
    name: 'WORKER 01',
    tunnel: 'B-04',
    distance: 37,
    confidence: 91.4,
    status: 'DETECTED',
    signalStrength: 88,
    xPct: 72,
    yPct: 31
  },
  {
    id: 'worker-02',
    name: 'WORKER 02',
    tunnel: 'C-02',
    distance: 64,
    confidence: 86.7,
    status: 'TRACKING',
    signalStrength: 72,
    xPct: 23,
    yPct: 70
  }
];

export const FALLBACK_MISSION: MissionStatus = {
  state: 'STANDBY',
  roverName: 'MINE SENSE ROVER 01',
  battery: 94,
  signal: 98,
  connection: 'LTE / RF MESH',
  ch4: 1.8,
  co: 34.2,
  temperature: 32.4,
  currentTunnel: 'JUNCTION B-04',
  activeAlerts: ['Elevated CO detected in Tunnel B-04', 'Thermal signature verified at 37m'],
  aiModules: {
    sensorAi: true,
    visionAi: true,
    featureFusion: true,
    riskClassifier: true
  }
};
