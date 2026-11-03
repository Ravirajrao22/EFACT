import React, { useState, useEffect } from 'react';
import { ArrowUp, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink text-paper pt-16 pb-8 px-4 md:px-8 border-t-ink-2 relative">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-paper/15">
          {/* Column 1: Logo & Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-paper shadow-[3px_3px_0_#FFF8EC] flex items-center justify-center p-0.5 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="EFACT Robotics Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-paper">
                  EFACT
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#B5AE9E]">
                  ROBOTICS
                </span>
              </div>
            </div>

            <p className="font-mono text-sm text-[#D8CEBC]">
              Making makers, one robot at a time.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="EFACT Instagram"
                className="w-9 h-9 rounded-full border-2 border-paper flex items-center justify-center text-paper hover:bg-lime hover:text-ink hover:border-lime transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="EFACT LinkedIn"
                className="w-9 h-9 rounded-full border-2 border-paper flex items-center justify-center text-paper hover:bg-lime hover:text-ink hover:border-lime transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="EFACT YouTube"
                className="w-9 h-9 rounded-full border-2 border-paper flex items-center justify-center text-paper hover:bg-lime hover:text-ink hover:border-lime transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore (2 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-yellow uppercase tracking-wider">
              Explore Platform
            </h4>
            <ul className="space-y-2 font-body text-sm text-[#D8CEBC]">
              <li>
                <a href="#playground" className="hover:text-lime transition-colors">
                  Simulator Playground
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-lime transition-colors">
                  How It Works (The Bridge)
                </a>
              </li>
              <li>
                <a href="#missions" className="hover:text-lime transition-colors">
                  Mission Board
                </a>
              </li>
              <li>
                <a href="#maker-path" className="hover:text-lime transition-colors">
                  The Maker Path
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: For Schools (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold text-yellow uppercase tracking-wider">
              For Schools
            </h4>
            <ul className="space-y-2 font-body text-sm text-[#D8CEBC]">
              <li>
                <a href="#schools" className="hover:text-lime transition-colors">
                  Request a Demo
                </a>
              </li>
              <li>
                <a href="#schools" className="hover:text-lime transition-colors">
                  Curriculum Mapping
                </a>
              </li>
              <li>
                <a href="#schools" className="hover:text-lime transition-colors">
                  Hardware Workshops
                </a>
              </li>
              <li>
                <a href="#schools" className="hover:text-lime transition-colors">
                  Teacher Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs text-[#D8CEBC]">
            <h4 className="font-mono text-xs font-bold text-yellow uppercase tracking-wider">
              Headquarters
            </h4>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-lime shrink-0" />
              <a href="mailto:hello@efactrobotics.com" className="hover:underline">
                hello@efactrobotics.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-lime shrink-0" />
              <span>+91 (800) 123-ROBOT</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-lime shrink-0 mt-0.5" />
              <span>EFACT Robotics Pvt. Ltd., Tech Park Campus, Bengaluru, KA, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#B5AE9E]">
          <div>
            © 2026 EFACT Robotics Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-paper transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-paper transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Fixed Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-lime text-ink border-ink-2 shadow-hard flex items-center justify-center hover:scale-110 active:translate-y-1 transition-all"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </footer>
  );
};

