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
import { WHATSAPP_NUMBER } from './config';

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

      {/* Floating WhatsApp Contact Button (bottom-left, 56px circle, lime with ink border and hard shadow) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi EFACT, I'd like to know more about EFACT Studio.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with EFACT on WhatsApp"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-lime text-ink border-ink-2 shadow-hard flex items-center justify-center hover:scale-110 active:translate-y-1 transition-all"
        title="Chat on WhatsApp"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.838 11.838 0 005.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

