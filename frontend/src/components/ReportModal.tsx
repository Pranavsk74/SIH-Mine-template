import React, { useState } from 'react';
import type { MissionReport, GenerateReportPayload } from '../types/report';
import { generateReport, getReportPdfUrl } from '../services/api';
import { FileText, Printer, Download, X, RefreshCw } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayload: GenerateReportPayload;
  onReportGenerated?: (report: MissionReport) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  currentPayload,
  onReportGenerated
}) => {
  const [step, setStep] = useState<'confirm' | 'generating' | 'preview'>('confirm');
  const [report, setReport] = useState<MissionReport | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setStep('generating');
    // Fast 280ms generation transition
    const data = await generateReport(currentPayload);
    setTimeout(() => {
      setReport(data);
      setStep('preview');
      if (onReportGenerated) onReportGenerated(data);
    }, 280);
  };

  const handleDownloadPdf = () => {
    if (!report) return;
    const url = getReportPdfUrl(report.id);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MINE_SENSE_REPORT_${report.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="report-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(36,23,25,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        overflowY: 'auto',
        animation: 'modalOverlayFade 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards'
      }}
    >
      <div
        className="report-modal-container"
        style={{
          width: 'min(820px, 94vw)',
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'reportContainerEmergence 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            background: 'var(--plum)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <FileText size={16} color="var(--gold)" />
            MINE SENSE // INCIDENT REPORT ENGINE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step === 'preview' && (
              <>
                <button
                  onClick={handlePrint}
                  className="btn btn-ghost"
                  style={{ padding: '6px 12px', fontSize: '11px', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  <Printer size={13} /> PRINT
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '11px' }}
                >
                  <Download size={13} /> DOWNLOAD PDF
                </button>
              </>
            )}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
          {step === 'confirm' && (
            <div>
              <div className="eyebrow" style={{ color: 'var(--orange)' }}>CONFIRM GENERATION DATA</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginTop: '6px', color: 'var(--ink)' }}>
                GENERATE MISSION REPORT
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '8px' }}>
                The report engine will aggregate active atmospheric telemetry, deep learning multimodal features, and target location data into a formal incident intelligence document.
              </p>

              <div
                style={{
                  marginTop: '24px',
                  background: 'var(--cream)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>REPORT TYPE</span>
                  <strong>MISSION SUMMARY & HAZARD EVALUATION</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>MISSION ID</span>
                  <strong>{currentPayload.missionId || 'MINE-04'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>RESPONSIBLE ROVER</span>
                  <strong>{currentPayload.rover || 'MINE SENSE ROVER-01'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>TUNNEL LOCATION</span>
                  <strong>{currentPayload.location || 'TUNNEL B-04'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>CURRENT RISK STATUS</span>
                  <strong style={{ color: currentPayload.status === 'HIGH' || currentPayload.status === 'CRITICAL' ? 'var(--orange)' : 'var(--ok)' }}>
                    {currentPayload.status || 'HIGH'} ({currentPayload.riskScore || 67}/100)
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>WORKERS LOCATED</span>
                  <strong>{currentPayload.workersDetected || 1} WORKER(S)</strong>
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={onClose} style={{ color: 'var(--plum)', borderColor: 'var(--line)' }}>
                  CANCEL
                </button>
                <button className="btn btn-primary" onClick={handleGenerate}>
                  <FileText size={15} /> GENERATE REPORT NOW
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={36} color="var(--orange)" className="spin" />
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginTop: '20px', color: 'var(--ink)' }}>
                GENERATING REPORT...
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
                Compiling multimodal sensor telemetry and deep learning feature vectors...
              </p>
            </div>
          )}

          {step === 'preview' && report && (
            <div className="printable-report" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '36px', color: 'var(--ink)' }}>
              {/* Report Header */}
              <div style={{ borderBottom: '2px solid var(--burgundy)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.18em', fontWeight: 900, color: 'var(--orange)', textTransform: 'uppercase' }}>
                    MINE SENSE // MISSION INTELLIGENCE REPORT
                  </div>
                  <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginTop: '6px', color: 'var(--plum)', lineHeight: 1 }}>
                    INCIDENT REPORT — {report.id}
                  </h1>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--muted)' }}>
                  <div><strong>DATE:</strong> {report.timestamp}</div>
                  <div><strong>ROVER:</strong> {report.rover}</div>
                  <div><strong>LOCATION:</strong> {report.location}</div>
                </div>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  margin: '20px 0',
                  padding: '12px 18px',
                  background: report.status === 'CRITICAL' || report.status === 'HIGH' ? '#fff0eb' : '#edf9f3',
                  borderLeft: `4px solid ${report.status === 'CRITICAL' || report.status === 'HIGH' ? 'var(--orange)' : 'var(--ok)'}`,
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 800, color: report.status === 'CRITICAL' || report.status === 'HIGH' ? 'var(--orange)' : 'var(--ok)' }}>
                    RISK EVALUATION: {report.status} ({report.riskScore}/100)
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '2px', fontWeight: 700 }}>
                    PRIMARY HAZARD: {report.primaryHazard}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--plum)', background: '#fff', padding: '6px 12px', borderRadius: '999px', border: '1px solid var(--line)' }}>
                  STATE: {report.missionState}
                </div>
              </div>

              {/* Section 1: Executive Summary */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--burgundy)', fontWeight: 800, borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
                  1. EXECUTIVE MISSION SUMMARY
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '8px', color: 'var(--ink)' }}>
                  {report.summary}
                </p>
              </div>

              {/* Section 2: Sensor Telemetry */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--burgundy)', fontWeight: 800, borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
                  2. REAL-TIME ATMOSPHERIC SENSOR TELEMETRY
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'var(--plum)', color: '#fff', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>CHANNEL</th>
                      <th style={{ padding: '8px 12px' }}>READOUT VALUE</th>
                      <th style={{ padding: '8px 12px' }}>EVALUATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.sensors).map(([channel, val], idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? '#faf7f3' : '#fff' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700 }}>{channel.toUpperCase()}</td>
                        <td style={{ padding: '8px 12px' }}>{val}</td>
                        <td style={{ padding: '8px 12px', color: channel.toUpperCase().includes('CH4') || channel.toUpperCase().includes('CO') ? 'var(--orange)' : 'var(--ok)', fontWeight: 800 }}>
                          {channel.toUpperCase().includes('CH4') || channel.toUpperCase().includes('CO') ? 'ELEVATED' : 'SAFE'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section 3: Deep Learning Analysis */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--burgundy)', fontWeight: 800, borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
                  3. MULTIMODAL DEEP LEARNING ANALYSIS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '10px', fontSize: '12px', background: 'var(--cream)', padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div><strong>SENSOR MODEL (LSTM):</strong> {report.ai.sensorModel || 'LSTM Net'}</div>
                  <div><strong>VISION MODEL (YOLO):</strong> {report.ai.visionModel || 'YOLOv8 FLIR LWIR'}</div>
                  <div><strong>FEATURE FUSION:</strong> {report.ai.fusion || 'Multimodal Concatenation'}</div>
                  <div><strong>RISK CLASSIFIER:</strong> {report.ai.classifier || 'MLP Classifier'}</div>
                </div>
              </div>

              {/* Section 4: Recommended Action Plan */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--burgundy)', fontWeight: 800, borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
                  4. RECOMMENDED RESPONSE PLAN
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '8px', color: 'var(--ink)' }}>
                  {report.recommendation}
                </p>
              </div>

              {/* Footer Disclaimer */}
              <div style={{ marginTop: '30px', paddingTop: '12px', borderTop: '1px dashed var(--line)', textAlign: 'center', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                MINE SENSE AI-POWERED MINE SAFETY & RESCUE ROVER — DEMO & SIMULATED HACKATHON DATA REPORT
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
