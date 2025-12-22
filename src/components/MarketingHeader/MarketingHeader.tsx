import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENUMFORROUTES } from '../../interfaces/enum';
import './MarketingHeader.css';

const MarketingHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLink = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('http')) {
      window.location.href = path;
    } else if (path.startsWith('/#')) {
      // Hash link to landing page section
      window.location.href = path;
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className={`marketing-header ${headerScrolled ? 'scrolled' : ''}`}>
      <nav className="marketing-nav container">
        <a
          href="/"
          className="marketing-logo"
          onClick={(e) => {
            e.preventDefault();
            navLink('/');
          }}
        >
          <img src="/assets/logo.png" alt="Open Planner - AI Scheduling App" />
        </a>

        <ul className="marketing-nav-links">
          <li>
            <a href="/#features">Features</a>
          </li>
          <li>
            <a href="/#pricing">Pricing</a>
          </li>
          <li>
            <a
              href={ENUMFORROUTES.PARENTS}
              onClick={(e) => {
                e.preventDefault();
                navLink(ENUMFORROUTES.PARENTS);
              }}
            >
              Parents
            </a>
          </li>
          <li>
            <a href="/#testimonials">Reviews</a>
          </li>
          <li>
            <a href="/#contact">Contact</a>
          </li>
          <li>
            <a
              href="/faqs"
              onClick={(e) => {
                e.preventDefault();
                navLink('/faqs');
              }}
            >
              FAQ's
            </a>
          </li>
        </ul>

        <div className="marketing-nav-actions">
          <button
            onClick={() => navLink(ENUMFORROUTES.LOGIN)}
            className="marketing-login-btn"
          >
            Log in
          </button>
          <button
            onClick={() => navLink(ENUMFORROUTES.REGISTRATION)}
            className="marketing-signup-btn"
          >
            Sign up
          </button>
        </div>

        <button
          className={`marketing-mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`marketing-mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="marketing-mobile-nav-links">
          <li>
            <a href="/#features" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
          </li>
          <li>
            <a href="/#pricing" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
          </li>
          <li>
            <a
              href={ENUMFORROUTES.PARENTS}
              onClick={(e) => {
                e.preventDefault();
                navLink(ENUMFORROUTES.PARENTS);
              }}
            >
              Parents
            </a>
          </li>
          <li>
            <a href="/#testimonials" onClick={() => setMobileMenuOpen(false)}>
              Reviews
            </a>
          </li>
          <li>
            <a href="/#contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
          </li>
          <li>
            <a
              href="/faqs"
              onClick={(e) => {
                e.preventDefault();
                navLink('/faqs');
              }}
            >
              FAQ's
            </a>
          </li>
        </ul>
        <div className="marketing-mobile-actions">
          <button
            onClick={() => navLink(ENUMFORROUTES.LOGIN)}
            className="marketing-mobile-login-btn"
          >
            Log in
          </button>
          <button
            onClick={() => navLink(ENUMFORROUTES.REGISTRATION)}
            className="marketing-mobile-signup-btn"
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
};

export default MarketingHeader;
