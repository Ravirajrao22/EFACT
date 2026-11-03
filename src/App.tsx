import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SimulatorSection } from './components/SimulatorSection';
import { HowItWorks } from './components/HowItWorks';
import { AttentionSpan } from './components/AttentionSpan';
import { MakerPath } from './components/MakerPath';
import { Missions } from './components/Missions';
import { ForSchools } from './components/ForSchools';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('playground');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [completedMissions, setCompletedMissions] = useState<
    Record<number, { blocks: number; steps: number }>
  >({});

  // Load completed missions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('efact_completed_missions');
      if (saved) {
        setCompletedMissions(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save to localStorage when updated
  const handleMissionCompleted = (lvlId: number, blocks: number, steps: number) => {
    setCompletedMissions((prev) => {
      const existing = prev[lvlId];
      // Keep best score
      const newScore = {
        blocks: existing ? Math.min(existing.blocks, blocks) : blocks,
        steps: existing ? Math.min(existing.steps, steps) : steps,
      };
      const updated = { ...prev, [lvlId]: newScore };
      try {
        localStorage.setItem('efact_completed_missions', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  // Scroll-spy observer for active section in navbar
  useEffect(() => {
    const sectionIds = ['playground', 'how-it-works', 'missions', 'maker-path', 'schools'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleSelectAndScrollToMission = (lvlId: number) => {
    setCurrentLevelId(lvlId);
    scrollToElement('playground');
  };

  const completedCount = Object.keys(completedMissions).length;

  return (
    <div className="min-h-screen bg-blueprint flex flex-col selection:bg-yellow selection:text-ink">
      {/* Skip to Content Accessible Link */}
      <a
        href="#playground"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue text-white font-mono font-bold rounded-lg border-2 border-white shadow-hard"
      >
        Skip to Simulator Playground
      </a>

      {/* Global Navigation */}
      <Navbar activeSection={activeSection} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartBuilding={() => scrollToElement('playground')}
          onExploreBridge={() => scrollToElement('how-it-works')}
        />

        {/* The Working Simulator Playground (Core feature) */}
        <SimulatorSection
          currentLevelId={currentLevelId}
          onSelectLevel={setCurrentLevelId}
          onMissionCompleted={handleMissionCompleted}
        />

        {/* How It Works (The Bridge) */}
        <HowItWorks />

        {/* Bold Statement Band: The Attention-Span Myth */}
        <AttentionSpan />

        {/* Mission Board Preview Grid */}
        <Missions
          completedMissions={completedMissions}
          onSelectAndScroll={handleSelectAndScrollToMission}
        />

        {/* Maker Path Trajectory */}
        <MakerPath completedCount={completedCount} />

        {/* For Schools & Curriculum Section */}
        <ForSchools />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

