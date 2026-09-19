import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import hazardCollapse from '../assets/hazard_collapse.png';
import hazardFlood from '../assets/hazard_flood.png';
import hazardHeat from '../assets/hazard_heat.png';
import hazardGas from '../assets/hazard_gas.png';
import hazardVisibility from '../assets/hazard_visibility.png';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface HazardDetail {
  id: string;
  num: string;
  name: string;
  hazardType: string;
  sensorUsed: string;
  status: 'MONITORING' | 'SAFE' | 'WARNING' | 'CRITICAL';
  description: string;
  art: string;
}

export const ProblemSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();

  const hazards: HazardDetail[] = [
    {
      id: 'gas',
      num: '01 / ATMOSPHERE',
      name: 'METHANE & CO',
      hazardType: 'Flammable & Toxic Explosive Gases',
      sensorUsed: 'MQ-4 CH4 + MQ-7 CO Gas Sensors',
      status: 'MONITORING',
      description: 'Accumulation of odorless methane (CH4) or carbon monoxide (CO) poses immediate explosion and asphyxiation risks underground.',
      art: hazardGas
    },
    {
      id: 'collapse',
      num: '02 / STRUCTURE',
      name: 'ROOF COLLAPSE',
      hazardType: 'Structural Roof & Strata Failure',
      sensorUsed: 'Piezoelectric Seismic Accelerometer',
      status: 'SAFE',
      description: 'Micro-seismic activity and rock displacement in unstable mine stopes cause sudden cave-ins and structural blockages.',
      art: hazardCollapse
    },
    {
      id: 'flood',
      num: '03 / WATER',
      name: 'WATER INFLUX',
      hazardType: 'Flash Flooding & Shaft Inundation',
      sensorUsed: 'Hydrostatic Pressure & Humidity Array',
      status: 'MONITORING',
      description: 'Rupture of underground aquifers leads to rapid tunnel flooding, isolating personnel in deep mine galleries.',
      art: hazardFlood
    },
    {
      id: 'visibility',
      num: '04 / VISION',
      name: 'ZERO VISIBILITY',
      hazardType: 'Dense Smoke, Dust & Total Darkness',
      sensorUsed: '850nm IR + FLIR Thermal LWIR Perception',
      status: 'SAFE',
      description: 'Coal dust clouds and post-explosion smoke blind human rescue teams, making conventional optical navigation impossible.',
      art: hazardVisibility
    },
    {
      id: 'heat',
      num: '05 / PEOPLE',
      name: 'EXTREME HEAT',
      hazardType: 'Geothermal Heat & Trapped Personnel',
      sensorUsed: 'NTC Thermistor + FLIR Thermal Vision',
      status: 'WARNING',
      description: 'High geothermal temperatures exceeding 40°C cause rapid heat exhaustion, requiring immediate location of trapped miners.',
      art: hazardHeat
    }
  ];

  const [activeHazard, setActiveHazard] = useState<HazardDetail | null>(hazards[0]);

  return (
    <section id="problem" className="section problem" ref={containerRef}>
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
            <div className="eyebrow">THE UNDERGROUND REALITY</div>
            <h2 style={{ marginTop: '12px' }}>
              CRITICAL <br />
              HAZARDS
            </h2>
          </div>
          <p>
            Subterranean mining is one of the world's most hazardous environments. MINE SENSE replaces human first-responders during toxic gas releases, cave-ins, and zero-visibility emergencies.
          </p>
        </div>

        <div
          className={`hazard-wall reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          {hazards.map((h) => {
            const isSelected = activeHazard?.id === h.id;
            return (
              <div
                key={h.id}
                className={`hazard ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveHazard(h)}
              >
                <span className="hazard-num">{h.num}</span>
                <img className="hazard-art" src={h.art} alt={h.name} />
                <strong>{h.name}</strong>
                <i className="bar"></i>
              </div>
            );
          })}
        </div>

        {/* Selected Hazard Detail Panel */}
        {activeHazard && (
          <div
            style={{
              marginTop: '32px',
              padding: '24px',
              background: '#f1e4d5',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              animation: 'panelFade 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase' }}>
                {activeHazard.num} — {activeHazard.hazardType}
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', margin: '6px 0 10px' }}>
                {activeHazard.name}
              </h3>
              <p style={{ maxWidth: '720px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>
                {activeHazard.description}
              </p>
              <div style={{ marginTop: '14px', display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 700 }}>
                <span><strong>Sensor:</strong> {activeHazard.sensorUsed}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className={`badge ${activeHazard.status === 'WARNING' || activeHazard.status === 'CRITICAL' ? 'warn' : 'safe'}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '12px' }}
              >
                {activeHazard.status === 'SAFE' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                STATUS: {activeHazard.status}
              </div>
              <button
                onClick={() => setActiveHazard(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
