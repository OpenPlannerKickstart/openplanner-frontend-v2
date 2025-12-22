import React, { useState, useEffect } from "react";
import MarketingHeader from "../../components/MarketingHeader/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter/MarketingFooter";
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
  const [openIndex, setOpenIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.pageYOffset > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (idx: number) => setOpenIndex((prev) => (prev === idx ? -1 : idx));

  return (
    <div className="faq-page">
      {/* Navigation */}
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <section className="faq-hero">
          <div className="faq-hero-bg">
            <div className="hero-bg-gradient"></div>
            <div className="hero-bg-radial1"></div>
          </div>

          <div className="container">
            <div className="section-header">
              <span className="section-label">Support</span>
              <h1 className="section-title" style={{fontSize: "clamp(2rem, 5vw, 3rem)"}}>Frequently Asked Questions</h1>
              <p className="section-desc">Find answers to common questions about Open Planner. Can't find what you're looking for? Contact us!</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="faq-list">
              {faqs.map((item, idx) => (
                <div key={item.question} className={`faq-item ${openIndex === idx ? "active" : ""}`}>
                  <button className="faq-question" onClick={() => toggle(idx)}>
                    {item.question}
                    <span className="faq-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
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

        {/* Contact CTA */}
        <section className="faq-cta">
          <div className="container">
            <h2 className="faq-cta-title">Still have questions?</h2>
            <p className="faq-cta-desc">We're here to help! Reach out to our support team.</p>
            <a href="mailto:admin@open-planner.com" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              admin@open-planner.com
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <MarketingFooter />

      <button className={`back-to-top ${showBackToTop ? "visible" : ""}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    </div>
  );
};

export default FAQPage;
