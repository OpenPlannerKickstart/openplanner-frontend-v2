import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENUMFORROUTES } from "../../interfaces/enum";
import "./FAQPage.css";

type FAQ = { question: string; answer: string };

const faqs: FAQ[] = [
  {
    question: "My syllabus isn't loading… what should I do?",
    answer:
      "Please make sure you are uploading the syllabus in PDF format. Allow up to two minutes and try refreshing the page. If load times are longer than a few minutes, please reach out to admin@open-planner.com and we will assist ASAP!",
  },
  {
    question: "Can you guarantee all of my due dates are correct?",
    answer:
      "No, Open Planner cannot guarantee 100% accuracy. Please double check our work by navigating to the courses page and selecting each course. This provides a split screen view of your uploaded syllabus and the dates we extracted for you to review and edit as needed.",
  },
  {
    question: "Can I export all of my assignments to a separate calendar?",
    answer:
      "Yes! You can export assignments to Outlook, Google, and Apple calendars. Simply click on an assignment, and you will see these export options in the bottom right of the 'Edit Assignment' page. You may be prompted to log in to your calendar provider.",
  },
  {
    question: "Can I track my assignments on my phone?",
    answer:
      "Yes! Download our app 'Open Planner' on the App Store or Google Play Store to stay organized on the go.",
  },
  {
    question: "Can I upload syllabi on the mobile app?",
    answer:
      "Yes. The mobile app includes all the same features and functionality as the website.",
  },
  {
    question: "Where can I update my email and password?",
    answer:
      "Head to the 'settings' page to update account info such as your email, password, username, etc. The settings icon can be found at the bottom of the left sidebar.",
  },
  {
    question: "Can I receive notifications?",
    answer:
      "Yes! Click into an assignment to pull up the 'Edit Assignment' page. At the bottom of this page you will find an option to add a notification. You can add multiple notifications for each assignment (ex. 7 days, 1 day, and 1 hour before an assignment is due). On the settings tab, you can adjust your notification preferences.",
  },
  {
    question: "Can I upload something other than a syllabus to Open Planner?",
    answer:
      "Yes! While Open Planner is specifically designed to pull due dates from a syllabus, we can read dates from any document. If you have a document with dates that you would like to upload to Open Planner, simply download it as a PDF and follow the same process you would for a syllabus.",
  },
  {
    question: "What do I do if my question is not answered here?",
    answer: "Please email admin@open-planner.com and we will get back to you ASAP!",
  },
];

const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.pageYOffset > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (idx: number) => setOpenIndex((prev) => (prev === idx ? -1 : idx));

  const navLink = (path: string) => {
    setMobileOpen(false);
    if (path.startsWith("http")) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <div className="faq-page">
      <header className="navbar">
        <nav className="container navbar-inner">
          <button className="navbar-logo" onClick={() => navLink("/")}>
            <img src="/assets/logo.png" alt="Open Planner" />
          </button>
          <ul className="navbar-menu">
            <li><a href="/#features" className="navbar-link">Features</a></li>
            <li><a href="/#pricing" className="navbar-link">Pricing</a></li>
            <li><a href="/#/parents" className="navbar-link">Parents</a></li>
            <li><a href="/#/faqs" className="navbar-link">FAQ&apos;s</a></li>
            <li><a href="/#contact" className="navbar-link">Contact</a></li>
          </ul>
          <div className="navbar-actions">
            <button className="navbar-login" onClick={() => navLink(ENUMFORROUTES.LOGIN)}>Log in</button>
            <button className="btn btn-primary" onClick={() => navLink(ENUMFORROUTES.REGISTRATION)}>Sign up</button>
          </div>
          <button
            className={`mobile-menu-btn ${mobileOpen ? "active" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((p) => !p)}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>

        <div className={`mobile-menu ${mobileOpen ? "active" : ""}`}>
          <ul className="mobile-menu-links">
            <li><a href="/#features" onClick={() => setMobileOpen(false)}>Features</a></li>
            <li><a href="/#pricing" onClick={() => setMobileOpen(false)}>Pricing</a></li>
            <li><a href="/#/parents" onClick={() => setMobileOpen(false)}>Parents</a></li>
            <li><a href="/#/faqs" onClick={() => setMobileOpen(false)}>FAQ&apos;s</a></li>
            <li><a href="/#contact" onClick={() => setMobileOpen(false)}>Contact</a></li>
          </ul>
          <div className="mobile-menu-actions">
            <button className="btn btn-secondary" onClick={() => navLink(ENUMFORROUTES.LOGIN)}>Log in</button>
            <button className="btn btn-primary" onClick={() => navLink(ENUMFORROUTES.REGISTRATION)}>Sign up</button>
          </div>
        </div>
      </header>

      <main>
        <section className="faq-hero">
          <div className="faq-hero-bg">
            <div className="hero-bg-gradient"></div>
            <div className="hero-bg-radial1"></div>
          </div>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Support</span>
              <h1 className="section-title">Frequently Asked Questions</h1>
              <p className="section-desc">
                Find answers to common questions about Open Planner. Can&apos;t find what you&apos;re looking for? Contact us!
              </p>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <div className="faq-list">
              {faqs.map((item, idx) => (
                <div key={item.question} className={`faq-item ${openIndex === idx ? "active" : ""}`}>
                  <button className="faq-question" onClick={() => toggle(idx)}>
                    {item.question}
                    <span className="faq-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p className="faq-answer-content">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="faq-cta">
          <div className="container">
            <h2 className="faq-cta-title">Still have questions?</h2>
            <p className="faq-cta-desc">We&apos;re here to help! Reach out to our support team.</p>
            <a href="mailto:admin@open-planner.com" className="btn btn-primary faq-cta-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              admin@open-planner.com
            </a>
          </div>
        </section>
      </main>

      <footer className="faq-footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <button onClick={() => navLink("/")} aria-label="Open Planner home">
              <img src="/assets/logo.png" alt="Open Planner" className="footer-logo" />
            </button>
            <p>AI-powered scheduling for students</p>
          </div>
          <nav className="footer-nav">
            <div>
              <h4 className="footer-nav-title">Product</h4>
              <ul className="footer-nav-links">
                <li><a href="/#">Home</a></li>
                <li><a href="/#features">Features</a></li>
                <li><a href="/#pricing">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-nav-title">Support</h4>
              <ul className="footer-nav-links">
                <li><a href="/#/faqs">FAQ&apos;s</a></li>
                <li><a href="/#contact">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-nav-title">Legal</h4>
              <ul className="footer-nav-links">
                <li><a href="/#/privacy-policy">Privacy Policy</a></li>
                <li><a href="/#/terms">Terms and Conditions</a></li>
              </ul>
            </div>
          </nav>
          <div className="footer-social">
            <h4 className="footer-social-title">Follow Us</h4>
            <div className="footer-social-links">
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 Open Planner. All rights reserved.</p>
        </div>
      </footer>

      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default FAQPage;
