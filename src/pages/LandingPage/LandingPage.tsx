import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ENUMFORROUTES } from '../../interfaces/enum';
import MarketingHeader from '../../components/MarketingHeader/MarketingHeader';
import MarketingFooter from '../../components/MarketingFooter/MarketingFooter';
import './LandingPage.css';

const testimonials = [
  { name: 'Sarah', school: 'University of Texas', logo: 'texas-logo.png', text: '"Open Planner has completely transformed how I manage my coursework. The syllabus scanning feature is a game-changer!"' },
  { name: 'James', school: 'SMU', logo: 'smu-logo.png', text: '"I used to miss deadlines all the time. Now with the notifications, I\'m always prepared and on top of my assignments."' },
  { name: 'Emily', school: 'TCU', logo: 'tcu-logo.png', text: '"The to-do list feature helps me prioritize what\'s important. Best study app I\'ve ever used!"' },
  { name: 'Michael', school: 'Baylor University', logo: 'baylor-logo.png', text: '"As a grad student juggling multiple classes, Open Planner keeps everything organized in one place."' },
  { name: 'Ashley', school: 'University of Washington', logo: 'washington-logo.png', text: '"I love how easy it is to upload my syllabus and have all my due dates automatically added. Saves so much time!"' },
  { name: 'David', school: 'Stanford University', logo: 'stanford-logo.png', text: '"The AI syllabus scanning is incredible. It pulled every single date perfectly from my 20-page syllabus!"' },
  { name: 'Jessica', school: 'University of Alabama', logo: 'alabama-logo.png', text: '"Finally an app that understands student life. The notifications keep me on track without being annoying."' },
  { name: 'Chris', school: 'Clemson University', logo: 'clemson-logo.png', text: '"My GPA went up after I started using Open Planner. I never miss a deadline anymore!"' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const [trackGap, setTrackGap] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeStartYRef = useRef<number | null>(null);
  const swipeStartedRef = useRef(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode detection
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Scroll effects (header shadow, shapes parallax, back-to-top)
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      setShowBackToTop(offset > 500);
      const shapes = document.querySelectorAll('.shape');
      shapes.forEach((shape, index) => {
        const speed = 0.1 + index * 0.05;
        (shape as HTMLElement).style.transform = `translateY(${offset * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Support deep links (#pricing, /pricing, etc.)
  useEffect(() => {
    const hashTarget = (location.hash || '').replace('#', '');
    const pathTarget = location.pathname.replace('/', '');
    const targetId = hashTarget || pathTarget;

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [location]);

  // Smooth scroll for in-page anchors
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll('.landing-page a[href^="#"]')
    ) as HTMLAnchorElement[];

    const onClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href) as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      const headerHeight = (document.querySelector('.header') as HTMLElement)?.offsetHeight || 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    };

    links.forEach((l) => l.addEventListener('click', onClick));
    return () => links.forEach((l) => l.removeEventListener('click', onClick));
  }, []);

  // Testimonials slider sizing
  useEffect(() => {
    const updateDimensions = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const containerStyles = window.getComputedStyle(container);
      const paddingLeft = parseFloat(containerStyles.paddingLeft || '0') || 0;
      const paddingRight = parseFloat(containerStyles.paddingRight || '0') || 0;
      const innerWidth = Math.max(0, container.clientWidth - paddingLeft - paddingRight);
      const computedGap = trackRef.current
        ? parseFloat(window.getComputedStyle(trackRef.current).gap || '0') || 0
        : 0;
      const nextVisible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      setVisibleCards(nextVisible);
      setTrackGap(computedGap);
      const available = innerWidth - computedGap * Math.max(0, nextVisible - 1);
      setCardWidth(available / nextVisible);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCards);

  // Keep slide in range when visibleCards changes
  useEffect(() => {
    if (currentSlide > maxIndex) {
      setCurrentSlide(maxIndex);
    }
  }, [currentSlide, maxIndex]);

  // Auto-play slider
  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => window.clearInterval(id);
  }, [maxIndex]);

  // AOS-like animation on scroll
  useEffect(() => {
    const animated = Array.from(document.querySelectorAll('[data-aos]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    animated.forEach((el) => observer.observe(el));

    // Kick off initial elements already in view
    setTimeout(() => {
      animated.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('aos-animate');
        }
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  // Counter animation for stats
  useEffect(() => {
    const counters = Array.from(document.querySelectorAll('.stat-number'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const targetText = el.dataset.target || el.textContent || '0';
            const finalVal = parseFloat(targetText);
            const suffix = targetText.replace(/[0-9.]/g, '');
            if (!Number.isNaN(finalVal)) {
              let current = 0;
              const increment = finalVal / 50;
              const duration = 1500;
              const stepTime = duration / 50;
              const update = () => {
                current += increment;
                if (current < finalVal) {
                  el.textContent = `${Math.ceil(current)}${suffix}`;
                  setTimeout(update, stepTime);
                } else {
                  el.textContent = targetText;
                }
              };
              update();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  // Ripple effect on primary buttons
  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll('.landing-page .btn-primary'));
    const handler = (e: any) => {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.pointerEvents = 'none';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.marginLeft = '-50px';
      ripple.style.marginTop = '-50px';

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    buttons.forEach((btn) => btn.addEventListener('click', handler));
    return () => buttons.forEach((btn) => btn.removeEventListener('click', handler));
  }, []);

  const trackStyle = {
    transform: `translateX(-${currentSlide * (cardWidth + trackGap)}px)`,
  };

  const cardStyle: React.CSSProperties = {
    width: cardWidth ? `${cardWidth}px` : undefined,
    flex: '0 0 auto',
  };

  const handleSwipeStart = (e: React.PointerEvent) => {
    // Only care about primary pointer/touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    swipeStartXRef.current = e.clientX;
    swipeStartYRef.current = e.clientY;
    swipeStartedRef.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleSwipeMove = (e: React.PointerEvent) => {
    if (swipeStartXRef.current === null || swipeStartYRef.current === null) return;
    const dx = e.clientX - swipeStartXRef.current;
    const dy = e.clientY - swipeStartYRef.current;

    // Only treat as a swipe once it's clearly horizontal
    if (!swipeStartedRef.current) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // vertical scroll gesture
        swipeStartXRef.current = null;
        swipeStartYRef.current = null;
        return;
      }
      swipeStartedRef.current = true;
    }

    // Prevent "page pull" while swiping horizontally
    e.preventDefault();
  };

  const handleSwipeEnd = (e: React.PointerEvent) => {
    if (swipeStartXRef.current === null || swipeStartYRef.current === null) return;
    const dx = e.clientX - swipeStartXRef.current;
    const threshold = 40;

    if (Math.abs(dx) >= threshold) {
      const next = dx < 0 ? currentSlide + 1 : currentSlide - 1;
      const clamped = Math.max(0, Math.min(maxIndex, next));
      if (clamped !== currentSlide) setCurrentSlide(clamped);
    }

    swipeStartXRef.current = null;
    swipeStartYRef.current = null;
    swipeStartedRef.current = false;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <MarketingHeader />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <span className="badge-dot"></span>
              AI-Powered Planning
            </span>
            <h1 className="hero-title">
              Stay Organized with our <span className="gradient-text">AI</span> <span className="gradient-text">Scheduling</span> Platform!
            </h1>
            <p className="hero-description">
              Automatically extract due dates from your syllabus, create tasks, and track progress with Open Planner!
            </p>
            <div className="hero-cta">
              <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary btn-large">
                Sign Up Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#contact" className="btn btn-outline-white btn-large">Contact Us</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">8K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Tasks Created</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">5.0</span>
                <span className="stat-label">App Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img src={isDarkMode ? "/assets/landingDark.png" : "/assets/landingLight.png"} alt="Open Planner - Mobile and Desktop App" className="hero-mockup-image" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2 className="section-title">What does Open Planner include?</h2>
            <p className="section-description">Stay on top of your study routine with effortless planning and organization.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card feature-card-large" data-aos="fade-up">
              <div className="feature-icon">
                <span>🗓️</span>
              </div>
              <h3 className="feature-title">Syllabus Upload Process</h3>
              <p className="feature-description">Simply upload your syllabus and we'll extract your due dates automatically. No more manual entry!</p>
              <div className="feature-visual">
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/HgPKD4nKR1Q"
                    title="Open Planner - Syllabus Upload"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">
                <span>📚</span>
              </div>
              <h3 className="feature-title">General Organization</h3>
              <p className="feature-description">Keep all your academic work organized in one place. Manage classes, assignments, and deadlines effortlessly.</p>
              <div className="feature-visual">
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/vhVMB26vNYc"
                    title="Open Planner - General Organization"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <span>📝</span>
              </div>
              <h3 className="feature-title">Customizable To-Do Lists</h3>
              <p className="feature-description">Create tasks, set priorities, and mark them as completed to stay on top of your academic goals.</p>
              <div className="feature-visual">
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/WfDCyfHwACg"
                    title="Open Planner - Task Lists"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Reviews</span>
            <h2 className="section-title">Don't take our word for it</h2>
            <p className="section-description">See what students are saying about Open Planner</p>
          </div>

          <div
            className="testimonials-slider"
            ref={sliderRef}
            onPointerDown={handleSwipeStart}
            onPointerMove={handleSwipeMove}
            onPointerUp={handleSwipeEnd}
            onPointerCancel={handleSwipeEnd}
          >
            <div className="testimonials-track" ref={trackRef} style={trackStyle}>
              {testimonials.map((testimonial, index) => (
                <div className="testimonial-card" key={index} style={cardStyle}>
                  <div className="testimonial-rating">★★★★★</div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <img className="author-logo" src={`/assets/${testimonial.logo}`} alt={testimonial.school} />
                    <div className="author-info">
                      <span className="author-name">{testimonial.name}</span>
                      <span className="author-role">{testimonial.school}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="slider-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                data-index={idx}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pricing</span>
            <h2 className="section-title">Find a plan that's right for you</h2>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card" data-aos="fade-up">
              <div className="pricing-header">
                <span className="pricing-duration">Free</span>
                <div className="pricing-price">
                  <span className="price-old price-old-hidden">&nbsp;</span>
                  <span className="price-current">$0</span>
                  <span className="price-per-month price-per-month-hidden">&nbsp;</span>
                </div>
              </div>
              <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary btn-full">Get started</button>
              <div className="pricing-features">
                <span className="features-label">FEATURES</span>
                <ul>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    3 syllabus uploads
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full website access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full mobile application access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Notifications
                  </li>
                </ul>
              </div>
            </div>

            <div className="pricing-card" data-aos="fade-up" data-aos-delay="100">
              <div className="pricing-header">
                <span className="pricing-duration">1 Month</span>
                <div className="pricing-price">
                  <span className="price-old">$4.99</span>
                  <span className="price-current">$3.99</span>
                  <span className="price-per-month price-per-month-hidden">&nbsp;</span>
                </div>
              </div>
              <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary btn-full">Get started</button>
              <div className="pricing-features">
                <span className="features-label">FEATURES</span>
                <ul>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited syllabus uploads
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full website access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full mobile application access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Notifications
                  </li>
                </ul>
              </div>
            </div>

            <div className="pricing-card pricing-card-popular" data-aos="fade-up" data-aos-delay="200">
              <span className="popular-badge">Most Popular</span>
              <div className="pricing-header">
                <span className="pricing-duration">6 Months</span>
                <div className="pricing-price">
                  <span className="price-old">$18.99</span>
                  <span className="price-current">$14.99</span>
                  <span className="price-per-month">$2.50/month</span>
                </div>
              </div>
              <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary btn-full">Get started</button>
              <div className="pricing-features">
                <span className="features-label">FEATURES</span>
                <ul>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited syllabus uploads
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full website access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full mobile application access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Notifications
                  </li>
                </ul>
              </div>
            </div>

            <div className="pricing-card pricing-card-best-value" data-aos="fade-up" data-aos-delay="300">
              <span className="best-value-badge">Best Value</span>
              <div className="pricing-header">
                <span className="pricing-duration">1 Year</span>
                <div className="pricing-price">
                  <span className="price-old">$29.99</span>
                  <span className="price-current">$23.99</span>
                  <span className="price-per-month">$2.00/month</span>
                </div>
              </div>
              <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary btn-full">Get started</button>
              <div className="pricing-features">
                <span className="features-label">FEATURES</span>
                <ul>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited syllabus uploads
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full website access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full mobile application access
                  </li>
                  <li>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Notifications
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Parent & Enterprise Cards */}
          <div className="special-pricing-grid">
            <div className="special-card parent-card" data-aos="fade-up">
              <div className="special-card-icon">👨‍👩‍👧‍👦</div>
              <h3>For Parents</h3>
              <p>Purchase a subscription for your student and help them stay organized.</p>
              <button
                className="btn btn-primary btn-full parent-btn"
                onClick={() => navigate(ENUMFORROUTES.PARENTS)}
              >
                Parent Checkout
                <svg className="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="special-card enterprise-card" data-aos="fade-up" data-aos-delay="100">
              <div className="special-card-icon">🏫</div>
              <h3>For Schools</h3>
              <p>Looking for multi-user licenses or institutional pricing? We've got you covered.</p>
              <a href="mailto:admin@open-planner.com?subject=School%20%2F%20Institutional%20Pricing%20Inquiry" className="btn btn-outline btn-full">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="app-download">
        <div className="container">
          <div className="download-content">
            <h2>Get Open Planner on your device</h2>
            <p>Available on iOS and Android</p>
            <div className="store-buttons">
              <a href="#" className="store-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="store-text">
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="store-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="store-text">
                  <span>Get it on</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <h2>Have questions?</h2>
            <p>Please contact us at <a href="mailto:admin@open-planner.com">admin@open-planner.com</a></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />

      {/* Back to top button */}
      <button className={`back-to-top ${showBackToTop ? 'visible' : ''}`} aria-label="Back to top" onClick={scrollToTop}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default LandingPage;
