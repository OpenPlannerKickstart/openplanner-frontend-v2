import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  getAllPlanAPI,
  parentsCreateSessionAPI,
} from "../../redux/Service/User/Settings/settings";
import { te } from "../../Utility/Toaster";
import { ENUMFORROUTES, ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT } from "../../interfaces/enum";
import "./ParentsLanding.css";

type Plan = {
  product_id: string;
  title: string;
  price: number;
  duration: string;
  features: string[];
  is_freemium?: boolean;
};

const undiscountedMap: Record<string, string> = {
  "for 1 month": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.ONE_MONTH,
  "for 6 month": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.SIX_MONTH,
  "for 1 year": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.ONE_YEAR,
};

const fallbackPlans: Plan[] = [
  { product_id: "one_month", title: "1 Month", price: 3.99, duration: "for 1 month", features: [] },
  { product_id: "six_month", title: "6 Months", price: 14.99, duration: "for 6 month", features: [] },
  { product_id: "one_year", title: "1 Year", price: 23.99, duration: "for 1 year", features: [] },
];

const isFreemiumPlan = (plan: Plan) =>
  plan?.is_freemium === true ||
  plan?.product_id === "freemium" ||
  (typeof plan?.price === "number" && plan.price <= 0);

const ParentsLanding = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [parentEmail, setParentEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const displayPlans = plans.length ? plans : fallbackPlans;

  const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

  useEffect(() => {
    // robots tag noindex
    let meta: HTMLMetaElement | null = document.querySelector('meta[name="robots"]');
    const previous = meta?.getAttribute("content") || "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex,nofollow");
    return () => {
      if (meta) {
        if (previous) meta.setAttribute("content", previous);
        else document.head.removeChild(meta);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      const response: any = await dispatch(getAllPlanAPI({ payment_method: "Stripe" }));
      if (response?.payload) {
        const list = (response.payload as Plan[])
          .slice()
          .filter((p) => !isFreemiumPlan(p))
          .sort((a, b) => Number(a.price) - Number(b.price));
        setPlans(list);
      }
    };
    fetchPlans();
  }, [dispatch]);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.pageYOffset > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const normalizeDuration = (d: string) => {
    const s = (d || "").toLowerCase();
    if (s.includes("1 month")) return "1m";
    if (s.includes("6 month")) return "6m";
    if (s.includes("1 year")) return "1y";
    return s || "other";
  };

  const totalItems = useMemo(() => Object.values(cart).reduce((s, q) => s + q, 0), [cart]);

  const totalAmount = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [productId, qty]) => {
        const plan = displayPlans.find((p) => p.product_id === productId);
        return plan ? sum + plan.price * qty : sum;
      }, 0),
    [cart, displayPlans]
  );

  const increment = (productId: string) => {
    const currentSelectedDuration = (() => {
      for (const [pid, qty] of Object.entries(cart)) {
        if ((qty as number) > 0) {
          const plan = displayPlans.find((p) => p.product_id === pid);
          return normalizeDuration(plan?.duration || "");
        }
      }
      return "";
    })();
    const thisPlan = displayPlans.find((p) => p.product_id === productId);
    const thisDuration = normalizeDuration(thisPlan?.duration || "");
    if (currentSelectedDuration && thisDuration && currentSelectedDuration !== thisDuration) {
      te("You can only purchase one plan type at a time.");
      return;
    }
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const decrement = (productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[productId] || 0;
      if (current <= 1) delete next[productId];
      else next[productId] = current - 1;
      return next;
    });
  };

  const handleProceed = () => {
    const items = Object.entries(cart)
      .map(([key, quantity]) => {
        const p: any = displayPlans.find((pl) => pl.product_id === key);
        const product_id = p?.product_id || key;
        const durationKey = normalizeDuration(p?.duration || "");
        return { product_id, quantity, durationKey };
      })
      .filter((i) => i.quantity > 0);
    if (items.length === 0) return;

    const distinctDurations = Array.from(new Set(items.map((i) => i.durationKey)));
    if (distinctDurations.length > 1) {
      te("You can purchase one plan type at a time.");
      return;
    }
    if (!isValidEmail(parentEmail)) {
      te("Please enter a valid parent email");
      return;
    }

    const grouped: Record<string, { product_id: string; quantity: number }[]> = {};
    for (const it of items) {
      if (!grouped[it.durationKey]) grouped[it.durationKey] = [];
      grouped[it.durationKey].push({ product_id: it.product_id, quantity: it.quantity });
    }
    const base = window.location.origin + "/#";
    const successUrlContinue = base + "/parents/continue";
    const successUrlFinal = base + "/parents/success";
    const cancelUrl = base + "/parents/cancel";
    const durations = Object.keys(grouped);
    const queue = durations.map((key, index) => ({
      items: grouped[key],
      parent_email: parentEmail.trim(),
      success_url: index === durations.length - 1 ? successUrlFinal : successUrlContinue,
      cancel_url: cancelUrl,
    }));

    try {
      localStorage.setItem("parent_email", parentEmail.trim());
      localStorage.setItem("parents_checkout_queue", JSON.stringify(queue));
      localStorage.setItem("parents_checkout_idx", "0");
      localStorage.setItem("parents_codes_accum", JSON.stringify([]));
      localStorage.setItem("parents_final_success", successUrlFinal.replace(base, ""));
    } catch {}

    dispatch(parentsCreateSessionAPI(queue[0]))
      .then((data: any) => {
        if (data?.url) {
          window.location.href = data.url;
        } else {
          te("Unable to start checkout. Please try again.");
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Checkout session failed.";
        te(msg);
      });
  };

  const navLink = (path: string) => {
    setMobileOpen(false);
    if (path.startsWith("http")) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <div className="parents-page">
      <header className="parents-navbar">
        <nav className="parents-container parents-navbar-inner">
          <button className="parents-navbar-logo" onClick={() => navLink("/")}>
            <img src="/assets/logo.png" alt="Open Planner" />
          </button>
          <ul className="parents-navbar-menu">
            <li><a className="parents-navbar-link" href="/#features">Features</a></li>
            <li><a className="parents-navbar-link" href="/#pricing">Pricing</a></li>
            <li><a className="parents-navbar-link" href="/#/parents">Parents</a></li>
            <li>
              <a
                className="parents-navbar-link"
                href="/#/faqs"
                onClick={(e) => {
                  e.preventDefault();
                  navLink("/faqs");
                }}
              >
                FAQ&apos;s
              </a>
            </li>
            <li><a className="parents-navbar-link" href="/#contact">Contact</a></li>
          </ul>
          <div className="parents-navbar-actions">
            <button className="parents-navbar-login" onClick={() => navLink(ENUMFORROUTES.LOGIN)}>Log in</button>
            <button className="parents-btn parents-btn-primary" onClick={() => navLink(ENUMFORROUTES.REGISTRATION)}>Sign up</button>
          </div>
          <button
            className={`parents-mobile-menu-btn ${mobileOpen ? "active" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((p) => !p)}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
        <div className={`parents-mobile-menu ${mobileOpen ? "active" : ""}`}>
          <ul className="parents-mobile-menu-links">
            <li><a href="/#features" onClick={() => setMobileOpen(false)}>Features</a></li>
            <li><a href="/#pricing" onClick={() => setMobileOpen(false)}>Pricing</a></li>
            <li><a href="/#/parents" onClick={() => setMobileOpen(false)}>Parents</a></li>
            <li>
              <a
                href="/#/faqs"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  navLink("/faqs");
                }}
              >
                FAQ&apos;s
              </a>
            </li>
            <li><a href="/#contact" onClick={() => setMobileOpen(false)}>Contact</a></li>
          </ul>
          <div className="parents-mobile-menu-actions">
            <button className="parents-btn parents-btn-secondary" onClick={() => navLink(ENUMFORROUTES.LOGIN)}>Log in</button>
            <button className="parents-btn parents-btn-primary" onClick={() => navLink(ENUMFORROUTES.REGISTRATION)}>Sign up</button>
          </div>
        </div>
      </header>

      <main>
        <section className="parents-hero">
          <div className="parents-hero-bg"></div>
          <div className="parents-container">
            <h1>Choose Your Plan</h1>

            <div className="pricing-cards-grid">
              {displayPlans.map((plan) => {
                const oldPrice = undiscountedMap[plan.duration] || "";
                const perMonth =
                  plan.duration === "for 6 month"
                    ? "$2.50/month"
                    : plan.duration === "for 1 year"
                    ? "$2.00/month"
                    : "";
                const isPopular = plan.duration === "for 1 year";
                const count = cart[plan.product_id] || 0;
                return (
                  <div
                    key={plan.product_id}
                    className={`pricing-card ${isPopular ? "pricing-card-popular" : ""}`}
                  >
                    {isPopular && <span className="popular-badge">Popular</span>}
                    <div className="pricing-header">
                      <span className="pricing-duration">{plan.title}</span>
                      <div className="pricing-price">
                        <span className={`price-old ${oldPrice ? "" : "price-old-hidden"}`}>
                          {oldPrice ? `$${oldPrice}` : "\u00A0"}
                        </span>
                        <span className="price-current">${plan.price}</span>
                        <span className={`price-per-month ${perMonth ? "" : "price-per-month-hidden"}`}>
                          {perMonth || "\u00A0"}
                        </span>
                      </div>
                    </div>
                    <div className="pricing-features">
                      <span className="features-label">FEATURES</span>
                      <ul>
                        {(Array.isArray(plan.features) && plan.features.length
                          ? plan.features
                          : [
                              "Unlimited syllabus uploads",
                              "Full website access",
                              "Full mobile application access",
                              "Notifications",
                            ]
                        ).map((f, i) => (
                          <li key={i}>
                            <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="student-counter">
                      <button type="button" className="student-btn minus" onClick={() => decrement(plan.product_id)}>
                        −
                      </button>
                      <span className="student-count">
                        {count} {count === 1 ? "student" : "students"}
                      </span>
                      <button type="button" className="student-btn plus" onClick={() => increment(plan.product_id)}>
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="parents-info">
              Student codes will be sent to your email. Students get access when they redeem a code.
              You can cancel anytime.
            </p>

            <div className="parents-form-wrap">
              <label htmlFor="parent-email" className="parents-form-label">
                Parent Email
              </label>
              <input
                type="email"
                id="parent-email"
                className="parents-input"
                placeholder="Enter your email address"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
              />
              <button
                type="button"
                className="checkout-btn-styled"
                disabled={totalItems === 0 || !isValidEmail(parentEmail)}
                onClick={handleProceed}
              >
                Proceed to checkout
              </button>
              <button
                type="button"
                className="billing-btn-styled"
                onClick={() => {
                  window.location.href = "https://billing.stripe.com/p/login/bJedR99D8gNU2Qj0iKbfO00";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Manage existing billing
              </button>
              <div style={{ marginTop: "0.75rem", color: "var(--neutral-700)", fontWeight: 600 }}>
                Total: ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="parents-footer">
        <div className="parents-container">
          <div className="parents-footer-content">
            <div>
              <button onClick={() => navLink("/")} aria-label="Open Planner home">
                <img src="/assets/logo.png" alt="Open Planner" className="parents-footer-logo" />
              </button>
              <p>AI-powered scheduling for students</p>
            </div>
            <div className="parents-footer-nav">
              <div>
                <h4 className="parents-footer-nav-title">Product</h4>
                <ul className="parents-footer-nav-links">
                  <li><a href="/#">Home</a></li>
                  <li><a href="/#features">Features</a></li>
                  <li><a href="/#pricing">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="parents-footer-nav-title">Support</h4>
                <ul className="parents-footer-nav-links">
                  <li>
                    <a
                      href="/#/faqs"
                      onClick={(e) => {
                        e.preventDefault();
                        navLink("/faqs");
                      }}
                    >
                      FAQ&apos;s
                    </a>
                  </li>
                  <li><a href="/#contact">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="parents-footer-nav-title">Legal</h4>
                <ul className="parents-footer-nav-links">
                  <li><a href="/#/privacy-policy">Privacy Policy</a></li>
                  <li><a href="/#/terms">Terms and Conditions</a></li>
                </ul>
              </div>
            </div>
            <div>
              <h4 className="parents-footer-social-title">Follow Us</h4>
              <div className="parents-footer-social-links">
                <a href="#" className="parents-footer-social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="parents-footer-social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="parents-footer-bottom">
            © 2025 Open Planner. All rights reserved.
          </div>
        </div>
      </footer>

      <button
        className={`parents-back-to-top ${showBackToTop ? "visible" : ""}`}
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

export default ParentsLanding;
