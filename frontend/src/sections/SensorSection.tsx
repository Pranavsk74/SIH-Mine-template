import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getSensors } from '../services/api';
import type { SensorMetric } from '../data/fallbackData';
import { FALLBACK_SENSORS } from '../data/fallbackData';
import { Activity, RefreshCw } from 'lucide-react';

export const SensorSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();
  const [sensors, setSensors] = useState<Record<string, SensorMetric>>(FALLBACK_SENSORS);
  const [selectedKey, setSelectedKey] = useState<string>('ch4');
  const [loading, setLoading] = useState<boolean>(false);
  const [switching, setSwitching] = useState<boolean>(false);

  useEffect(() => {
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    setLoading(true);
    const data = await getSensors();
    setSensors(data);
    setLoading(false);
  };

  const handleSelectSensor = (key: string) => {
    if (key === selectedKey) return;
    setSwitching(true);
    setSelectedKey(key);
    setTimeout(() => setSwitching(false), 200);
  };

  const activeSensor = sensors[selectedKey] || sensors.ch4;

  // Render clean SVG sparkline graph with lightweight 250ms draw-once effect
  const renderSparkline = (history: number[]) => {
    if (!history || history.length === 0) return null;
    const min = Math.min(...history) * 0.9;
    const max = Math.max(...history) * 1.1 || 1;
    const width = 600;
    const height = 200;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / (max - min)) * height;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef6c22" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ef6c22" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="var(--orange)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: switching ? 1000 : 0,
            transition: 'stroke-dashoffset 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
        <polygon
          fill="url(#sensorGrad)"
          points={`0,${height} ${points} ${width},${height}`}
          style={{
            opacity: switching ? 0 : 1,
            transition: 'opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
      </svg>
    );
  };

  return (
    <section id="sensors" className="section sensor" ref={containerRef}>
      <div className="container">
        <div
          className="problem-head"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div>
            <div className="eyebrow">ENVIRONMENTAL MONITORING</div>
            <h2 style={{ marginTop: '12px' }}>
              ATMOSPHERIC <br />
              SENSORS
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ margin: 0 }}>
              Multi-gas sampling and micro-seismic monitoring provide early warnings before catastrophic gas explosions or roof collapse occur.
            </p>
            <button
              onClick={fetchSensorData}
              className="btn btn-ghost"
              style={{ padding: '8px 14px', borderColor: 'var(--line)', color: 'var(--plum)' }}
              title="Refresh Telemetry"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        <div
          className={`sensor-grid reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          {/* Left: Sensor Selector List */}
          <div className="panel sensor-list">
            {Object.values(sensors).map((s) => {
              const isActive = s.key === selectedKey;
              return (
                <button
                  key={s.key}
                  className={`sensor-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectSensor(s.key)}
                >
                  <div>
                    <strong>{s.name}</strong>
                    <small>{s.status} — Threshold Normal</small>
                  </div>
                  <div className="value">
                    {s.value} <span style={{ fontSize: '13px', fontWeight: 400 }}>{s.unit}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Graph and Detail View */}
          <div className="panel chart-panel">
            <div className="chart-top">
              <div
                style={{
                  opacity: switching ? 0.4 : 1,
                  transform: switching ? 'translateY(2px)' : 'none',
                  transition: 'opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                <span className="eyebrow" style={{ color: 'var(--muted)' }}>
                  LIVE READOUT — {activeSensor.name}
                </span>
                <div className="value-big" style={{ marginTop: '4px' }}>
                  {activeSensor.value} <span style={{ fontSize: '24px', fontWeight: 400, color: 'var(--muted)' }}>{activeSensor.unit}</span>
                </div>
              </div>
              <div
                className={`badge ${
                  activeSensor.status === 'WARNING' || activeSensor.status === 'CRITICAL' ? 'warn' : 'safe'
                }`}
              >
                STATUS: {activeSensor.status}
              </div>
            </div>

            <div className="chart">
              {renderSparkline(activeSensor.history)}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
                {activeSensor.description}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--orange)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={14} /> LIVE SAMPLING
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
