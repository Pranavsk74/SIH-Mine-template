import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface PipelineNode {
  id: string;
  iconNum: string;
  title: string;
  subtitle: string;
  description: string;
}

export const SystemSection: React.FC = () => {
  const { containerRef, isVisible } = useIntersectionObserver();

  const nodes: PipelineNode[] = [
    {
      id: 'rover',
      iconNum: '01',
      title: 'ROVER',
      subtitle: 'AUTONOMOUS UNIT',
      description: 'Tracked autonomous underground vehicle equipped with environmental sensors and optical cameras.'
    },
    {
      id: 'sensors',
      iconNum: '02',
      title: 'SENSORS',
      subtitle: 'GAS & ENVIRONMENT',
      description: 'Continuous sampling of CH4, CO, ambient temperature, humidity, and seismic micro-vibrations.'
    },
    {
      id: 'vision',
      iconNum: '03',
      title: 'VISION',
      subtitle: 'RGB / IR / FLIR',
      description: 'Multispectral perception combining RGB, 850nm Night Vision, and FLIR Long-Wave Thermal imaging.'
    },
    {
      id: 'edge',
      iconNum: '04',
      title: 'EDGE DATA',
      subtitle: 'JETSON ORIN',
      description: 'Low-latency pre-processing and sensor filtering directly on the embedded rover hardware.'
    },
    {
      id: 'dl',
      iconNum: '05',
      title: 'DEEP LEARNING',
      subtitle: 'LSTM + YOLO',
      description: 'LSTM neural net for temporal gas trends + YOLO v8 for visual object/worker detection.'
    },
    {
      id: 'fusion',
      iconNum: '06',
      title: 'FEATURE FUSION',
      subtitle: 'MULTIMODAL FUSION',
      description: 'Concatenates high-level sensor feature vectors with visual detection bounding box embeddings.'
    },
    {
      id: 'risk',
      iconNum: '07',
      title: 'RISK',
      subtitle: 'UNIFIED INDEX',
      description: 'MLP neural network computes real-time hazard severity score (0-100) and danger status.'
    }
  ];

  const [activeNode, setActiveNode] = useState<PipelineNode>(nodes[1]);

  return (
    <section id="pipeline" className="section story" ref={containerRef}>
      <div className="container">
        <div
          className="story-head"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>SYSTEM ARCHITECTURE</div>
            <h2 style={{ marginTop: '12px' }}>
              PIPELINE <br />
              FLOW
            </h2>
          </div>
          <p>
            The MINE SENSE pipeline seamlessly connects physical autonomous hardware, edge telemetry gathering, multispectral computer vision, and deep learning feature fusion into one unified mission response.
          </p>
        </div>

        <div
          className={`pipeline reveal ${isVisible ? 'show' : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          {nodes.map((node, index) => {
            const isSelected = activeNode.id === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  className="pipe-node"
                  onClick={() => setActiveNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="icon"
                    style={{
                      background: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? 'var(--plum)' : 'var(--gold)',
                      borderColor: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.22)',
                      boxShadow: isSelected ? '0 0 20px rgba(255,189,50,0.5)' : 'none',
                      transform: isSelected ? 'scale(1.08)' : 'none',
                      transition: 'all 0.18s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                  >
                    {node.iconNum}
                  </div>
                  <b>{node.title}</b>
                </div>
                {index < nodes.length - 1 && <div className="pipe-arrow"></div>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Details */}
        <div
          style={{
            marginTop: '45px',
            padding: '24px 30px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 800 }}>
              STAGE {activeNode.iconNum} — {activeNode.subtitle}
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff', margin: '4px 0 8px' }}>
              {activeNode.title}
            </h3>
            <p style={{ color: '#e8d8cf', fontSize: '15px', maxWidth: '800px', lineHeight: 1.5 }}>
              {activeNode.description}
            </p>
          </div>
          <div
            style={{
              padding: '12px 20px',
              border: '1px solid var(--gold)',
              borderRadius: '999px',
              color: 'var(--gold)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              fontWeight: 800,
              whiteSpace: 'nowrap'
            }}
          >
            ACTIVE PIPELINE
          </div>
        </div>
      </div>
    </section>
  );
};
