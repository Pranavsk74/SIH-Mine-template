import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getWorkers } from '../services/api';
import type { WorkerData } from '../data/fallbackData';
import { FALLBACK_WORKERS } from '../data/fallbackData';
import { MapPin, Signal, ShieldCheck } from 'lucide-react';

export const WorkerLocatorSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();
  const [workers, setWorkers] = useState<WorkerData[]>(FALLBACK_WORKERS);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-01');
  const [panelFade, setPanelFade] = useState<boolean>(false);

  useEffect(() => {
    getWorkers().then((res) => {
      if (res && res.length > 0) setWorkers(res);
    });
  }, []);

  const handleSelectWorker = (id: string) => {
    if (id === selectedWorkerId) return;
    setPanelFade(true);
    setSelectedWorkerId(id);
    setTimeout(() => setPanelFade(false), 200);
  };

  const activeWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

  return (
    <section id="locator" className="section map" ref={containerRef}>
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
            <div className="eyebrow">SUBTERRANEAN NAVIGATION</div>
            <h2 style={{ marginTop: '12px' }}>
              WORKER <br />
              LOCATOR
            </h2>
          </div>
          <p>
            Combining RF mesh beacons with thermal LWIR vision allows the autonomous rover to map underground tunnels and calculate shortest-path rescue routes to trapped miners.
          </p>
        </div>

        <div
          className={`map-layout reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          {/* Mine Schematic Tunnel Map */}
          <div className="mine-map">
            <div className="map-grid" />

            {/* Tunnel Schematics */}
            <div className="tunnel t1" />
            <div className="tunnel t2" />
            <div className="tunnel t3" />
            <div className="tunnel t4" />
            <div className="junction" />

            {/* Rover Node */}
            <div className="rover-dot" title="ROVER 01" />
            <div className="map-label label-rover">ROVER 01 (JUNCTION)</div>

            {/* Worker Nodes */}
            {workers.map((w) => {
              const isSelected = w.id === selectedWorkerId;
              return (
                <React.Fragment key={w.id}>
                  <div
                    className={`worker-dot w${w.id === 'worker-01' ? '1' : '2'} ${isSelected ? 'selected' : ''}`}
                    style={{ left: `${w.xPct}%`, top: `${w.yPct}%` }}
                    onClick={() => handleSelectWorker(w.id)}
                    title={`${w.name} in Tunnel ${w.tunnel}`}
                  />
                  <div
                    className="map-label"
                    style={{
                      left: `${w.xPct - 2}%`,
                      top: `${w.yPct - 7}%`,
                      color: isSelected ? 'var(--cyan)' : '#ffffffa0'
                    }}
                  >
                    {w.name} ({w.tunnel})
                  </div>
                </React.Fragment>
              );
            })}

            {/* Dynamic Calculated Route Line */}
            <div
              className={`route ${activeWorker ? 'on' : ''}`}
              style={{
                width: activeWorker?.id === 'worker-01' ? '32%' : '26%',
                transform: activeWorker?.id === 'worker-01' ? 'rotate(-18deg)' : 'rotate(62deg)',
                top: activeWorker?.id === 'worker-01' ? '42%' : '42%',
                left: activeWorker?.id === 'worker-01' ? '44%' : '44%'
              }}
            />
          </div>

          {/* Selected Worker Info Panel */}
          <div
            className="worker-info"
            style={{
              opacity: panelFade ? 0.4 : 1,
              transform: panelFade ? 'translateY(5px)' : 'none',
              transition: 'opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 800 }}>
              RESCUE TARGET — {activeWorker.name}
            </div>
            <h3 style={{ marginTop: '4px' }}>TUNNEL {activeWorker.tunnel}</h3>

            <div className="big">{activeWorker.distance}m</div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#d5c7c2', textTransform: 'uppercase', marginBottom: '20px' }}>
              DISTANCE FROM ROVER
            </div>

            <div className="info-row">
              <span>THERMAL CONFIDENCE</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 900 }}>{activeWorker.confidence}%</span>
            </div>

            <div className="info-row">
              <span>VERIFICATION</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>YOLO + THERMAL LWIR</span>
            </div>

            <div className="info-row">
              <span>SIGNAL MESH</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                <Signal size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {activeWorker.signalStrength}% STRENGTH
              </span>
            </div>

            <div className="info-row">
              <span>RESCUE STATUS</span>
              <span style={{ color: 'var(--ok)', fontWeight: 900 }}>
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {activeWorker.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              {workers.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleSelectWorker(w.id)}
                  className={`btn ${w.id === selectedWorkerId ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, padding: '10px', fontSize: '11px' }}
                >
                  <MapPin size={12} /> {w.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
