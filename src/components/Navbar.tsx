import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { PHONE_NUMBER } from '../config';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Why EFACT', href: '#why' },
    { name: 'What we bring', href: '#offerings' },
    { name: 'In action', href: '#in-action' },
    { name: 'Programme', href: '#programme' },
    { name: 'For Schools', href: '#schools' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-paper/92 backdrop-blur-md border-b-ink-2 px-4 md:px-8 transition-colors">
      <div className="max-w-[1240px] h-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group select-none"
          aria-label="EFACT Robotics Home"
        >
          <div className="w-10 h-10 rounded-xl bg-white border-ink-2 shadow-hard-sm flex items-center justify-center p-0.5 overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="./logo.png"
              alt="EFACT Robotics Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-ink">
              EFACT
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-ink-soft">
              ROBOTICS
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`relative font-body font-semibold text-base text-ink transition-colors group py-1 ${
                  isActive ? 'text-ink font-bold' : 'hover:text-blue'
                }`}
              >
                {link.name}
                {/* Active Indicator Underline */}
                <span
                  className={`absolute left-0 bottom-0 w-full h-[3px] rounded-full transition-all duration-200 ${
                    isActive ? 'bg-lime' : 'bg-blue scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => handleLinkClick('#schools')}
            className="px-5 py-2.5 rounded-full bg-blue text-white font-body font-bold text-sm btn-brutal flex items-center gap-1.5 shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <span>Request a School Demo</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border-ink-2 bg-paper text-ink shadow-hard-sm"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-paper z-40 border-t-ink-2 p-6 flex flex-col justify-between overflow-y-auto"
        >
          <div className="flex flex-col gap-5 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="font-heading font-extrabold text-2xl text-ink hover:text-blue py-2 border-b border-ink/10 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="font-mono text-xs text-ink-soft">→</span>
              </a>
            ))}
          </div>

          <div className="pt-8 flex flex-col gap-4">
            <button
              onClick={() => handleLinkClick('#schools')}
              className="w-full py-3.5 rounded-full bg-blue text-white font-heading font-extrabold text-base btn-brutal text-center"
            >
              Request a School Demo
            </button>

            {/* Mobile Sheet Footer Phone Link */}
            <div className="text-center pt-2">
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-soft hover:text-ink font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-blue" />
                <span>Call our team: {PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
