import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Cpu, Flame, Activity } from 'lucide-react';

interface AiBlock {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
}

export const IntelligenceSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();

  const blocks: AiBlock[] = [
    {
      id: 'sensor-data',
      tag: 'INPUT / 01',
      title: 'SENSOR DATA',
      subtitle: 'CH4, CO, Temp, Vib',
      description: 'Continuous 100Hz telemetry streams from atmospheric gas sensors, thermistors, and seismic accelerometers.'
    },
    {
      id: 'lstm',
      tag: 'MODEL / 02',
      title: 'LSTM NET',
      subtitle: 'Temporal Pattern Extraction',
      description: 'Long Short-Term Memory network captures non-linear gas accumulation rates and micro-seismic trend curves.'
    },
    {
      id: 'yolo',
      tag: 'MODEL / 03',
      title: 'YOLO v8',
      subtitle: 'Visual Object Perception',
      description: 'Real-time object detector processes thermal and IR video feeds to output worker and obstacle bounding boxes.'
    },
    {
      id: 'fusion',
      tag: 'FUSION / 04',
      title: 'FEATURE FUSION',
      subtitle: 'Multimodal Vector Concatenation',
      description: 'Combines 128-dim LSTM temporal sensor embeddings with 256-dim YOLO visual detection feature vectors.'
    },
    {
      id: 'mlp',
      tag: 'CLASSIFIER / 05',
      title: 'MLP CLASSIFIER',
      subtitle: 'Unified Risk Index Output',
      description: 'Multi-layer perceptron classifies danger level and outputs real-time risk score from 0 to 100.'
    }
  ];

  const [activeBlock, setActiveBlock] = useState<AiBlock>(blocks[3]);
  const [riskScore, setRiskScore] = useState<number>(67);
  const [riskStatus, setRiskStatus] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [alertText, setAlertText] = useState<string>(
    'FLAMMABLE METHANE TRACE + ELEVATED TEMPERATURE IN TUNNEL B-04'
  );
  const [updatingRisk, setUpdatingRisk] = useState<boolean>(false);

  const handleSimulateRisk = (level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL') => {
    setUpdatingRisk(true);
    setRiskStatus(level);
    if (level === 'LOW') {
      setRiskScore(18);
      setAlertText('ALL ATMOSPHERIC CHANNELS SAFE. STABLE AIRFLOW.');
    } else if (level === 'MODERATE') {
      setRiskScore(42);
      setAlertText('ELEVATED CO DRIFT DETECTED IN SECTOR C-02.');
    } else if (level === 'HIGH') {
      setRiskScore(67);
      setAlertText('FLAMMABLE METHANE TRACE + ELEVATED TEMPERATURE IN TUNNEL B-04.');
    } else if (level === 'CRITICAL') {
      setRiskScore(94);
      setAlertText('CRITICAL: EXPONENTIAL CH4 RISE + SEISMIC STRATA DISPLACEMENT!');
    }
    setTimeout(() => setUpdatingRisk(false), 220);
  };

  return (
    <section id="intelligence" className="section ai" ref={containerRef}>
      <div className="container">
        <div
          className="ai-head"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div>
            <div className="eyebrow">MULTIMODAL DEEP LEARNING</div>
            <h2 style={{ marginTop: '12px' }}>
              FEATURE FUSION <br />& RISK MODEL
            </h2>
          </div>
          <p>
            Rather than relying on isolated sensor thresholds, MINE SENSE uses multimodal feature fusion: concatenating temporal gas trends (LSTM) with spatial thermal perception (YOLO) into a deep classifier.
          </p>
        </div>

        {/* DL Architecture Flow with 50ms Stagger Entrance */}
        <div className="ai-flow">
          {blocks.map((b, idx) => {
            const isSelected = activeBlock.id === b.id;
            return (
              <div
                key={b.id}
                className="ai-box"
                onClick={() => setActiveBlock(b)}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--orange)' : 'var(--line)',
                  boxShadow: isSelected ? '0 10px 25px rgba(239,108,34,0.16)' : 'none',
                  transform: isVisible
                    ? isSelected
                      ? 'translateY(-3px)'
                      : 'none'
                    : 'translateY(12px)',
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.05}s, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.05}s, border-color 0.2s ease`
                }}
              >
                <span>{b.tag}</span>
                <h3>{b.title}</h3>
                <small style={{ display: 'block', color: 'var(--muted)', marginTop: '4px', fontSize: '11px' }}>
                  {b.subtitle}
                </small>
              </div>
            );
          })}
        </div>

        {/* Active DL Block Description Panel */}
        <div
          style={{
            marginTop: '20px',
            padding: '20px 24px',
            background: 'var(--cream)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--orange)', fontWeight: 800 }}>
              {activeBlock.tag} — {activeBlock.title}
            </div>
            <p style={{ marginTop: '4px', color: 'var(--ink)', fontSize: '14px', margin: 0 }}>
              {activeBlock.description}
            </p>
          </div>
          <Cpu size={24} color="var(--orange)" />
        </div>

        {/* Real-Time Risk Score & Control Panel */}
        <div
          className={`risk reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.15s' }}
        >
          <div className="risk-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="eyebrow" style={{ color: 'var(--gold)' }}>UNIFIED HAZARD RISK INDEX</div>
              <div className={`badge ${riskStatus === 'CRITICAL' || riskStatus === 'HIGH' ? 'warn' : 'safe'}`}>
                {riskStatus} RISK
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <div
                className="risk-number"
                style={{
                  opacity: updatingRisk ? 0.3 : 1,
                  transform: updatingRisk ? 'scale(0.96)' : 'none',
                  transition: 'opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {riskScore}
              </div>
              <span style={{ fontSize: '24px', color: 'var(--gold)', fontFamily: 'Georgia, serif' }}>/ 100</span>
            </div>

            <div className="risk-meter">
              <i
                style={{
                  width: `${riskScore}%`,
                  background:
                    riskScore > 75
                      ? 'var(--danger)'
                      : riskScore > 50
                      ? 'var(--orange)'
                      : riskScore > 25
                      ? 'var(--gold)'
                      : 'var(--ok)',
                  transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            </div>

            <p style={{ marginTop: '20px', fontSize: '12px', letterSpacing: '0.08em', color: '#e5d1c6' }}>
              <strong>AI ALERT LOG:</strong> {alertText}
            </p>
          </div>

          <div className="risk-controls">
            <div className="eyebrow" style={{ color: 'var(--orange)' }}>SIMULATE HAZARD SCENARIO</div>
            <h3 style={{ fontFamily: 'Georgia, serif', marginTop: '8px', fontSize: '24px' }}>
              LIVE RISK METER CONTROLS
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
              Click any scenario to test the multimodal feature fusion risk engine response:
            </p>

            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((lvl) => {
                const isActive = riskStatus === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => handleSimulateRisk(lvl)}
                    className="btn"
                    style={{
                      padding: '12px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      background: isActive ? 'var(--plum)' : '#fff',
                      color: isActive ? '#fff' : 'var(--plum)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {lvl === 'LOW' && <Activity size={14} style={{ display: 'inline', marginRight: '6px' }} />}
                    {lvl === 'CRITICAL' && <Flame size={14} style={{ display: 'inline', marginRight: '6px' }} />}
                    {lvl} RISK
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
