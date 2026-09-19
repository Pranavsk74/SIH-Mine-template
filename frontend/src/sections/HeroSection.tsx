import React, { useEffect, useState } from 'react';
import entranceImg from '../assets/entrance.png';
import cartImg from '../assets/cart.png';
import oreImg from '../assets/ore.png';
import { ArrowDown, Cpu, Activity } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 30);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Precise Canva-style Match & Move scroll parameters
  const typographyY = -Math.min(scrollY * 0.12, 35);
  const typographyScale = Math.max(1 - scrollY * 0.00015, 0.98);
  const truckY = -Math.min(scrollY * 0.06, 15);
  const cartY = -Math.min(scrollY * 0.32, 90);
  const cartScale = Math.max(1 - scrollY * 0.00025, 0.97);
  const rocksY = -Math.min(scrollY * 0.08, 20);

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section hero" id="hero">
      <div className="container hero-grid">
        <div
          className="hero-copy"
          style={{
            transform: `translateY(${typographyY}px) scale(${typographyScale})`,
            transformOrigin: 'left top',
            opacity: loaded ? 1 : 0,
            transition: loaded
              ? 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)'
              : 'opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div
            className="eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(8px)',
              transition: 'all 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            <Cpu size={14} /> AI-POWERED MINE SAFETY & RESCUE ROVER
          </div>

          <h1
            style={{
              marginTop: '16px',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(10px)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.03s'
            }}
          >
            MINE <br />
            <span style={{ color: 'var(--gold)' }}>SENSE</span>
          </h1>

          <p
            className="sub"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(10px)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.06s'
            }}
          >
            Autonomous underground exploration, multimodal hazard perception, and real-time survivor locating in high-risk mining environments.
          </p>

          <div
            className="cta-row"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1) 0.09s'
            }}
          >
            <button className="btn btn-primary" onClick={() => handleScrollTo('#pipeline')}>
              <Activity size={16} /> EXPLORE SYSTEM
            </button>
            <button className="btn btn-ghost" onClick={() => handleScrollTo('#mission')}>
              MISSION CONTROL
            </button>
          </div>
        </div>

        <div
          className="hero-art"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1) 0.05s, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1) 0.05s'
          }}
        >
          <div className="hero-label">
            FIRST RESPONDER<br />BEFORE HUMAN EXPOSURE
          </div>

          {/* Mining truck entrance artwork with subtle translateY */}
          <img
            className="entrance"
            src={entranceImg}
            alt="Mining entrance artwork from template"
            style={{
              transform: `translateY(${truckY}px)`,
              transition: 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />

          {/* Exact Mine Cart Asset (Labelled 1) with Canva-style Match & Move scroll flow */}
          <img
            className="cart"
            src={cartImg}
            alt="Mining cart artwork from template"
            style={{
              transform: `translateY(${cartY}px) scale(${cartScale})`,
              transition: 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />

          {/* Mining ore rocks artwork with subtle translateY */}
          <img
            className="ore"
            src={oreImg}
            alt="Mining ore artwork"
            style={{
              transform: `translateY(${rocksY}px)`,
              transition: 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
        </div>
      </div>

      <div className="hero-scroll" style={{ cursor: 'pointer' }} onClick={() => handleScrollTo('#problem')}>
        SCROLL TO DISCOVER <ArrowDown size={12} style={{ display: 'inline', marginLeft: '6px' }} />
      </div>

      <div className="stamp">
        AUTONOMOUS<br />RESCUE<br />ROVER
      </div>
    </section>
  );
};
