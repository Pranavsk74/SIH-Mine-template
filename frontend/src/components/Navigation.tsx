import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Micro entrance trigger
    const timer = setTimeout(() => setLoaded(true), 40);

    // Passive scroll listener only updating state on threshold change
    let currentScrolled = false;
    const handleScroll = () => {
      const isPast = window.scrollY > 20;
      if (isPast !== currentScrolled) {
        currentScrolled = isPast;
        setScrolled(isPast);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver for active section tracking
    const sectionIds = ['hero', 'problem', 'pipeline', 'sensors', 'vision', 'intelligence', 'locator', 'rover', 'mission'];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (typeof IntersectionObserver !== 'undefined' && sectionElements.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' }
      );

      sectionElements.forEach((el) => observer.observe(el));

      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
        sectionElements.forEach((el) => observer.unobserve(el));
      };
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'Problem', href: '#problem', id: 'problem' },
    { label: 'System', href: '#pipeline', id: 'pipeline' },
    { label: 'Sensors', href: '#sensors', id: 'sensors' },
    { label: 'Vision', href: '#vision', id: 'vision' },
    { label: 'DL Risk', href: '#intelligence', id: 'intelligence' },
    { label: 'Locator', href: '#locator', id: 'locator' },
    { label: 'Rover', href: '#rover', id: 'rover' },
    { label: 'Mission Control', href: '#mission', id: 'mission' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`nav ${scrolled ? 'scrolled' : ''} ${loaded ? 'nav-loaded' : ''}`}
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
      }}
    >
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldAlert size={16} color="#ffbd32" />
        MINE <span>SENSE</span>
      </div>

      <nav className="navlinks">
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.label}
              href={link.href}
              className={isActive ? 'active-link' : ''}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Mobile Toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: '0',
            right: '0',
            background: 'rgba(35,12,24,0.96)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px 14px',
                borderRadius: '8px',
                color: activeSection === link.id ? 'var(--gold)' : '#fff',
                background: activeSection === link.id ? 'rgba(255,189,50,0.12)' : 'transparent',
                fontWeight: activeSection === link.id ? 700 : 500
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
