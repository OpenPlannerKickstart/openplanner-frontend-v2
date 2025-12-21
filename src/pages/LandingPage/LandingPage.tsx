import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ENUMFORROUTES } from '../../interfaces/enum';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll effects (header shadow, shapes parallax, back-to-top)
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      setShowBackToTop(offset > 500);
      setHeaderScrolled(offset > 50);
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
      const width = container.offsetWidth;
      const nextVisible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      setVisibleCards(nextVisible);
      setCardWidth(width / nextVisible);
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
    transform: `translateX(-${currentSlide * cardWidth}px)`,
  };

  const cardStyle = {
    minWidth: cardWidth ? `${cardWidth}px` : undefined,
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <nav className="nav container">
          <a href="#" className="logo">
            <img src="/assets/logo.png" alt="Open Planner - AI Scheduling App" className="logo-image" />
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li>
              <a
                href={ENUMFORROUTES.PARENTS}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(ENUMFORROUTES.PARENTS);
                }}
              >
                Parents
              </a>
            </li>
                        <li><a href="#testimonials">Reviews</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li>
                            <a
                                href="/#/faqs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/faqs");
                                }}
                            >
                                FAQ&apos;s
                            </a>
                        </li>
          </ul>

          <div className="nav-actions">
            <button onClick={() => navigate(ENUMFORROUTES.LOGIN)} className="btn btn-ghost">Log in</button>
            <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary">Sign up</button>
          </div>

          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
            <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
            <li>
              <a
                href={ENUMFORROUTES.PARENTS}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(ENUMFORROUTES.PARENTS);
                }}
              >
                Parents
              </a>
            </li>
            <li><a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a></li>
                        <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
                        <li>
                            <a
                                href="/#/faqs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
                                    navigate("/faqs");
                                }}
                            >
                                FAQ&apos;s
                            </a>
                        </li>
          </ul>
          <div className="mobile-nav-actions">
            <button onClick={() => navigate(ENUMFORROUTES.LOGIN)} className="btn btn-ghost">
              Log in
            </button>
            <button onClick={() => navigate(ENUMFORROUTES.REGISTRATION)} className="btn btn-primary">
              Sign up
            </button>
          </div>
        </div>
      </header>

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
            <img src="/assets/Open Planner Your Upcoming Week (5) copy.png" alt="Open Planner - Mobile and Desktop App" className="hero-mockup-image" />
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

          <div className="testimonials-slider">
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

            <div className="pricing-card" data-aos="fade-up" data-aos-delay="200">
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

            <div className="pricing-card pricing-card-popular" data-aos="fade-up" data-aos-delay="300">
              <span className="popular-badge">Popular</span>
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
              <a href="#contact" className="btn btn-outline btn-full">Contact Sales</a>
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
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#" className="logo">
                <img src="/assets/logo.png" alt="Open Planner - AI Scheduling App" className="logo-image footer-logo" />
              </a>
              <p className="footer-tagline">AI-powered scheduling for students</p>
            </div>

            <nav className="footer-nav">
              <div className="footer-nav-group">
                <h4>Product</h4>
                                <ul>
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#features">Features</a></li>
                                    <li><a href="#pricing">Pricing</a></li>
                                </ul>
              </div>
              <div className="footer-nav-group">
                <h4>Support</h4>
                                <ul>
                                    <li>
                                        <a
                                            href="/#/faqs"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/faqs");
                                            }}
                                        >
                                            FAQ&apos;s
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#/privacy-policy"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/privacy-policy");
                                            }}
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#/terms"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/terms");
                                            }}
                                        >
                                            Terms and Conditions
                                        </a>
                                    </li>
                                    <li><a href="#contact">Contact Us</a></li>
                                </ul>
              </div>
              <div className="footer-nav-group">
                                <h4>Legal</h4>
                                <ul>
                                    <li>
                                        <a
                                            href="/#/privacy-policy"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/privacy-policy");
                                            }}
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#/terms"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/terms");
                                            }}
                                        >
                                            Terms and Conditions
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Open Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
