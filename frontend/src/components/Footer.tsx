import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>
          <ShieldCheck size={16} /> MINE SENSE
        </div>
        <h2>
          FIRST RESPONDER <br />
          BEFORE HUMAN EXPOSURE
        </h2>
        <p>
          Autonomous underground mine exploration, real-time multimodal hazard perception, and intelligent survivor locator system. Built for extreme safety in high-risk mining stopes.
        </p>
        <div className="mark">
          MINE SENSE &copy; 2026 / TEAM CLAUDE'S PLAN / HACKATHON EDITION
        </div>
      </div>
    </footer>
  );
};
