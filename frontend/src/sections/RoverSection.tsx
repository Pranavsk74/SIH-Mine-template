import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import roverImg from '../assets/rover.png';
import { Shield, Radio, Cpu, Eye, Zap, Flame } from 'lucide-react';

export const RoverSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();

  const specs = [
    { title: 'GAS SENSORS', value: 'CH4, CO, O2, H2S', icon: Flame },
    { title: 'THERMAL CAMERA', value: 'FLIR LWIR 640x512', icon: Eye },
    { title: 'NIGHT VISION', value: '850nm IR Array', icon: Zap },
    { title: 'EDGE PROCESSING', value: 'NVIDIA Jetson Orin', icon: Cpu },
    { title: 'WIRELESS LINK', value: 'Sub-GHz RF Mesh', icon: Radio },
    { title: 'NAVIGATION', value: 'SLAM LiDAR + IMU', icon: Shield }
  ];

  return (
    <section id="rover" className="section rover" ref={containerRef}>
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
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>FIRST RESPONDER HARDWARE</div>
            <h2 style={{ marginTop: '12px', color: '#fff' }}>
              RESCUE ROVER <br />
              SPECS
            </h2>
          </div>
          <p style={{ color: '#e5d1c6' }}>
            Built with reinforced chassis and explosion-proof enclosure, the MINE SENSE rover ventures into volatile underground mine shafts where human intervention is hazardous.
          </p>
        </div>

        <div
          className={`rover-layout reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          {/* Rover Artwork with Radial Glowing Background */}
          <div className="rover-art">
            <img src={roverImg} alt="Mine Sense Rescue Rover Artwork" />
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 800 }}>
              HARDWARE SPECIFICATIONS
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginTop: '6px', color: '#fff' }}>
              EXPLOSION-PROOF DESIGN
            </h3>
            <p style={{ color: '#e5d1c6', fontSize: '14px', marginTop: '10px', lineHeight: 1.5 }}>
              Custom tracked drive train with IP67 waterproofing, flameproof casing, and high-torque electric motors capable of climbing 35° rubble inclines.
            </p>

            <div className="spec-grid">
              {specs.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div className="spec" key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconComp size={14} color="var(--gold)" />
                      <small>{item.title}</small>
                    </div>
                    <b>{item.value}</b>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
