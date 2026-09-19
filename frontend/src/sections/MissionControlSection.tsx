import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import {
  getMissionStatus,
  startMission,
  pauseMission,
  returnToBase,
  getReports
} from '../services/api';
import type { MissionStatus } from '../data/fallbackData';
import { FALLBACK_MISSION } from '../data/fallbackData';
import type { MissionReport, GenerateReportPayload } from '../types/report';
import { ReportModal } from '../components/ReportModal';
import { Play, Pause, RotateCcw, Activity, Battery, Signal, AlertTriangle, CheckCircle2, FileText, ExternalLink } from 'lucide-react';

export const MissionControlSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();
  const [mission, setMission] = useState<MissionStatus>(FALLBACK_MISSION);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [stateTransition, setStateTransition] = useState<boolean>(false);

  // Report System State
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [recentReports, setRecentReports] = useState<MissionReport[]>([]);

  useEffect(() => {
    fetchMissionStatus();
    fetchRecentReports();
  }, []);

  const fetchMissionStatus = async () => {
    const res = await getMissionStatus();
    if (res) setMission(res);
  };

  const fetchRecentReports = async () => {
    const list = await getReports();
    if (list && list.length > 0) setRecentReports(list);
  };

  const triggerStateAnimation = () => {
    setStateTransition(true);
    setTimeout(() => setStateTransition(false), 200);
  };

  const handleStart = async () => {
    triggerStateAnimation();
    setActionLoading(true);
    const updated = await startMission();
    setMission(updated);
    setActionLoading(false);
  };

  const handlePause = async () => {
    triggerStateAnimation();
    setActionLoading(true);
    const updated = await pauseMission();
    setMission(updated);
    setActionLoading(false);
  };

  const handleReturn = async () => {
    triggerStateAnimation();
    setActionLoading(true);
    const updated = await returnToBase();
    setMission(updated);
    setActionLoading(false);
  };

  const currentPayload: GenerateReportPayload = {
    missionId: 'MINE-04',
    rover: mission.roverName || 'MINE SENSE ROVER-01',
    location: mission.currentTunnel || 'TUNNEL B-04',
    status: mission.co > 30 ? 'HIGH' : 'MODERATE',
    riskScore: mission.co > 30 ? 67 : 42,
    primaryHazard: mission.co > 30 ? 'Elevated CO Gas & Methane Trace' : 'Stable Ambient Telemetry',
    workersDetected: 1,
    sensors: {
      "CH4": `${mission.ch4} %`,
      "CO": `${mission.co} PPM`,
      "Temperature": `${mission.temperature} °C`,
      "Humidity": "78.5 %",
      "Vibration": "0.14 g"
    },
    ai: {
      "sensorModel": "LSTM Temporal Net",
      "visionModel": "YOLO v8 Thermal Perception",
      "fusion": "Multimodal Vector Fusion",
      "classifier": "MLP Classifier"
    },
    missionState: mission.state
  };

  const handleReportGenerated = (newReport: MissionReport) => {
    setRecentReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
  };

  return (
    <section id="mission" className="section control" ref={containerRef}>
      <div className="container">
        <div
          className="problem-head"
          style={{
            color: '#fff',
            opacity: isVisible ? (isReportModalOpen ? 0.85 : 1) : 0,
            transform: isVisible ? (isReportModalOpen ? 'translateY(-6px)' : 'none') : 'translateY(12px)',
            transition: 'opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1), transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: 'var(--cyan)' }}>LIVE COMMAND & TELEMETRY</div>
            <h2 style={{ marginTop: '12px', color: '#fff' }}>
              MISSION <br />
              CONTROL
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <p style={{ color: '#bba8a4', margin: 0 }}>
              Real-time telemetry command dashboard for controlling autonomous rover navigation, monitoring live atmospheric safety metrics, and managing AI inference models.
            </p>
            {/* GENERATE REPORT BUTTON */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn btn-primary"
              style={{ marginTop: '8px', padding: '12px 20px', fontSize: '12px' }}
            >
              <FileText size={16} /> GENERATE MISSION REPORT
            </button>
          </div>
        </div>

        <div
          className={`control-shell reveal ${isVisible ? 'show' : ''}`}
          style={{
            transitionDelay: '0.08s',
            transform: isReportModalOpen ? 'scale(0.985) translateY(-8px)' : 'none',
            opacity: isReportModalOpen ? 0.92 : 1,
            transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div className="control-top">
            <div>
              <div className="control-title">MINE SENSE DASHBOARD</div>
              <div style={{ fontSize: '11px', color: '#bba8a4', marginTop: '4px' }}>
                CURRENT LOCATION: {mission.currentTunnel}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="live"
                style={{
                  opacity: stateTransition ? 0.4 : 1,
                  transform: stateTransition ? 'scale(0.96)' : 'none',
                  transition: 'opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                <Activity size={12} style={{ display: 'inline', marginRight: '6px' }} />
                STATE: {mission.state}
              </div>
            </div>
          </div>

          <div className="dash">
            {/* Column 1: Rover Telemetry */}
            <div className="dash-card">
              <h4>ROVER TELEMETRY</h4>
              <div className="metric">
                <span>BATTERY</span>
                <b>
                  <Battery size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {mission.battery}%
                </b>
              </div>
              <div className="metric">
                <span>SIGNAL MESH</span>
                <b style={{ color: 'var(--gold)' }}>
                  <Signal size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {mission.signal}%
                </b>
              </div>
              <div className="metric">
                <span>CONNECTION</span>
                <small>{mission.connection}</small>
              </div>

              <h4 style={{ marginTop: '24px' }}>MISSION CONTROLS</h4>
              <div className="mission-actions">
                <button
                  onClick={handleStart}
                  disabled={actionLoading || mission.state === 'ACTIVE'}
                  className="btn btn-primary"
                  style={{ opacity: mission.state === 'ACTIVE' ? 0.6 : 1 }}
                >
                  <Play size={12} /> START MISSION
                </button>
                <button
                  onClick={handlePause}
                  disabled={actionLoading || mission.state === 'PAUSED'}
                  className="btn btn-ghost"
                  style={{ opacity: mission.state === 'PAUSED' ? 0.6 : 1 }}
                >
                  <Pause size={12} /> PAUSE
                </button>
                <button
                  onClick={handleReturn}
                  disabled={actionLoading || mission.state === 'RETURNING'}
                  className="btn btn-dark"
                  style={{ background: '#35212b', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <RotateCcw size={12} /> RETURN TO BASE
                </button>
              </div>
            </div>

            {/* Column 2: Atmospheric Metrics */}
            <div className="dash-card">
              <h4>ATMOSPHERIC & ENVIRONMENTAL METRICS</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#bba8a4' }}>CH4 METHANE</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', color: 'var(--gold)' }}>
                    {mission.ch4}%
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--ok)' }}>SAFE</span>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#bba8a4' }}>CO TOXIC GAS</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', color: 'var(--orange)' }}>
                    {mission.co} <span style={{ fontSize: '12px' }}>PPM</span>
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--orange)' }}>ELEVATED</span>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#bba8a4' }}>TEMPERATURE</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', color: 'var(--cyan)' }}>
                    {mission.temperature}°C
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--ok)' }}>NORMAL</span>
                </div>
              </div>

              <h4 style={{ marginTop: '24px' }}>ACTIVE ALERTS & TELEMETRY LOGS</h4>
              {mission.activeAlerts.map((alert, idx) => (
                <div className="alert" key={idx}>
                  <AlertTriangle size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  {alert}
                </div>
              ))}
            </div>

            {/* Column 3: AI Inference Module Status & Recent Reports */}
            <div className="dash-card">
              <h4>AI MODULE INFERENCE</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {Object.entries(mission.aiModules).map(([modKey, isActive]) => {
                  const modLabels: Record<string, string> = {
                    sensorAi: 'SENSOR AI (LSTM)',
                    visionAi: 'VISION AI (YOLO)',
                    featureFusion: 'MULTIMODAL FUSION',
                    riskClassifier: 'RISK CLASSIFIER (MLP)'
                  };
                  return (
                    <div
                      key={modKey}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{modLabels[modKey] || modKey}</span>
                      <span className={isActive ? 'status-ok' : 'status-warn'} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}>
                        <CheckCircle2 size={12} /> {isActive ? 'ACTIVE' : 'STANDBY'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* RECENT REPORTS LIST */}
              <h4 style={{ marginTop: '20px' }}>RECENT MISSION REPORTS</h4>
              {recentReports.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#bba8a4', fontStyle: 'italic' }}>
                  No reports generated yet. Click Generate Report above.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {recentReports.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setIsReportModalOpen(true)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div>
                        <strong>{r.id}</strong> — <span style={{ color: 'var(--gold)' }}>{r.status} RISK</span>
                      </div>
                      <ExternalLink size={12} color="var(--gold)" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REPORT GENERATION MODAL */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentPayload={currentPayload}
        onReportGenerated={handleReportGenerated}
      />
    </section>
  );
};
