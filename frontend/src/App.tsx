import React from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './sections/HeroSection';
import { ProblemSection } from './sections/ProblemSection';
import { SystemSection } from './sections/SystemSection';
import { SensorSection } from './sections/SensorSection';
import { VisionSection } from './sections/VisionSection';
import { IntelligenceSection } from './sections/IntelligenceSection';
import { WorkerLocatorSection } from './sections/WorkerLocatorSection';
import { RoverSection } from './sections/RoverSection';
import { MissionControlSection } from './sections/MissionControlSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="app-root">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SystemSection />
        <SensorSection />
        <VisionSection />
        <IntelligenceSection />
        <WorkerLocatorSection />
        <RoverSection />
        <MissionControlSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
