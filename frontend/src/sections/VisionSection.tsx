import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getVisionModes } from '../services/api';
import type { VisionMode } from '../data/fallbackData';
import { FALLBACK_VISION_MODES } from '../data/fallbackData';
import cartImg from '../assets/cart.png';
import oreImg from '../assets/ore.png';
import { Eye, Shield, Zap } from 'lucide-react';

export const VisionSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();
  const [modes, setModes] = useState<VisionMode[]>(FALLBACK_VISION_MODES);
  const [activeModeId, setActiveModeId] = useState<'rgb' | 'night' | 'thermal'>('thermal');
  const [scanning, setScanning] = useState<boolean>(false);

  useEffect(() => {
    getVisionModes().then((res) => {
      if (res && res.length > 0) setModes(res);
    });
  }, []);

  const handleModeChange = (id: 'rgb' | 'night' | 'thermal') => {
    if (id === activeModeId) return;
    setActiveModeId(id);
    setScanning(true);
    setTimeout(() => setScanning(false), 280);
  };

  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];

  return (
    <section id="vision" className="section cv" ref={containerRef}>
      <div className="container">
        <div
          className="problem-head"
          style={{
            color: '#fff',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: 'var(--cyan)' }}>MULTISPECTRAL COMPUTER VISION</div>
            <h2 style={{ marginTop: '12px', color: '#fff' }}>
              THERMAL & IR <br />
              PERCEPTION
            </h2>
          </div>
          <p style={{ color: '#e8d8cf' }}>
            When explosion dust and heavy coal smoke blind standard cameras, FLIR Long-Wave Infrared and active 850nm IR illuminate subterranean obstacles and locate human body heat signatures.
          </p>
        </div>

        <div
          className={`cv-layout reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          {/* Main Computer Vision Frame */}
          <div className="vision">
            {/* Dynamic vision background gradient per mode */}
            <div
              className="vision-bg"
              style={{
                background:
                  activeModeId === 'thermal'
                    ? 'radial-gradient(circle at 75% 30%, #a8341b 0%, #35152e 50%, #100c15 100%)'
                    : activeModeId === 'night'
                    ? 'radial-gradient(circle at 50% 50%, #1b4d3e 0%, #0d261e 60%, #05100c 100%)'
                    : 'radial-gradient(circle at 75% 20%, #6b3025 0, transparent 35%), linear-gradient(120deg, #100c15, #35212b)',
                transition: 'background 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />

            <div className="tunnel-lines" />

            {/* Short 280ms scan overlay on mode switch */}
            {scanning && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 0%, rgba(101,226,229,0.18) 50%, transparent 100%)',
                  pointerEvents: 'none',
                  animation: 'shortScan 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                }}
              />
            )}

            {/* Background elements */}
            <img className="vision-cart" src={cartImg} alt="Mine cart visual" />
            <img className="vision-thermal" src={oreImg} alt="Thermal ore visual" />

            {/* Bounding Box Overlays */}
            {activeMode.detections.map((det, index) => (
              <div
                key={index}
                className="detect"
                data-label={`${det.label} ${det.confidence}%`}
                style={{
                  left: `${det.x}%`,
                  top: `${det.y}%`,
                  width: `${det.width}%`,
                  height: `${det.height}%`,
                  borderColor: det.color || 'var(--cyan)',
                  opacity: scanning ? 0.3 : 1,
                  transform: scanning ? 'scale(0.97)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            ))}

            {/* HUD Overlay */}
            <div className="vision-hud">
              <div className="hud-tag">
                <Eye size={12} style={{ display: 'inline', marginRight: '6px' }} />
                CV MODE: {activeMode.label.toUpperCase()}
              </div>
              <div className="hud-corner">
                LATENCY: 12ms | JETSON ORIN NANO | YOLOv8
              </div>
            </div>
          </div>

          {/* Mode Selector & Detection Telemetry */}
          <div className="mode-panel">
            <h3>PERCEPTION MODES</h3>

            <div className="mode-list">
              {modes.map((m) => {
                const isActive = m.id === activeModeId;
                return (
                  <button
                    key={m.id}
                    className={`mode ${isActive ? 'active' : ''}`}
                    onClick={() => handleModeChange(m.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {m.id === 'thermal' ? <Zap size={16} /> : m.id === 'night' ? <Eye size={16} /> : <Shield size={16} />}
                      <strong>{m.label}</strong>
                    </div>
                    <small>{m.description}</small>
                  </button>
                );
              })}
            </div>

            {/* Detections Summary */}
            <div className="detections">
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cyan)', fontWeight: 800 }}>
                YOLO OBJECT DETECTIONS ({activeMode.detections.length})
              </div>
              {activeMode.detections.map((d, i) => (
                <div className="det-row" key={i}>
                  <span>{d.label}</span>
                  <span className="confidence">{d.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
