import React, { useEffect, useState } from "react";
import MarketingHeader from "../../components/MarketingHeader/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter/MarketingFooter";

type LegalLayoutProps = {
  title: string;
  updated?: string;
  children: React.ReactNode;
};

const LegalLayout = ({ title, updated, children }: LegalLayoutProps) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.pageYOffset > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="faq-page">
      <MarketingHeader />

      <main className="legal-page">
        <div className="container">
          <div className="legal-content">
            <h1 className="legal-title">{title}</h1>
            {updated && <p className="legal-updated">{updated}</p>}
            {children}
          </div>
        </div>
      </main>

      <MarketingFooter />

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

export default LegalLayout;
