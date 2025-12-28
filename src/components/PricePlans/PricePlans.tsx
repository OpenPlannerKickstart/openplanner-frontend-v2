import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT,
  ENUMFORROUTES,
} from "../../interfaces/enum";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { createCheckOutAPI } from "../../redux/Service/auth/signup";
import { getDecodeIDToken, isNullUndefinedOrBlank, getToken } from "../../Utility/Helper";
import {
  getAllPlanAPI,
  updatePlanAPI,
  getUserAPI,
  getSubscriptionStatusAPI,
} from "../../redux/Service/User/Settings/settings";
import { te } from "../../Utility/Toaster";
import "./PricePlans.css";

const undiscountedMap = {
  "for 1 month": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.ONE_MONTH,
  "for 6 month": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.SIX_MONTH,
  "for 1 year": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.ONE_YEAR,
};

const FREEMIUM_PLAN = {
  product_id: "freemium",
  title: "Freemium",
  price: 0,
  Stripe_id: "freemium",
  duration: "",
  features: [
    "3 syllabus uploads",
    "Full website access",
    "Full mobile application access",
    "Notifications",
  ],
  is_freemium: true,
};

const isFreemiumPlan = (plan: any): boolean => {
  const price =
    typeof plan?.price === "string" ? parseFloat(plan.price) : plan?.price;
  return (
    plan?.is_freemium === true ||
    plan?.product_id === "freemium" ||
    (typeof price === "number" && !isNaN(price) && price <= 0)
  );
};

const ensureFreemiumPlan = (list: any[]) => {
  // Remove any existing freemium plan from API and use our constant instead
  const filteredList = Array.isArray(list) ? list.filter(p => !isFreemiumPlan(p)) : [];
  // Always add our FREEMIUM_PLAN with correct features
  filteredList.unshift({ ...FREEMIUM_PLAN });
  return filteredList;
};

export const PricePlans = (props) => {
  const [userData, setuserData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaidPlanNotice, setShowPaidPlanNotice] = useState(false);
  const hasSubscriptionFlag = useMemo(() => {
    try {
      return localStorage.getItem("has_subscription") === "true";
    } catch {
      return false;
    }
  }, []);

  // rely directly on props.updatePlan instead of local state to avoid initial-render race
  const dispatch: AppDispatch = useDispatch();
  const savedLoginData = useSelector(
    (state: any) => state?.SignupReducer?.savedLoginData
  );
  // removed unused local modal states; using explicit confirmation modal already below
  const navigate = useNavigate();

  const tokenClaims = useMemo(() => {
    try {
      return getDecodeIDToken();
    } catch {
      return null;
    }
  }, []);

  const handleFreemiumEntry = useCallback(() => {
    // If on paid plan, surface notice and avoid sending freemium product_id to BE
    if (hasSubscriptionFlag) {
      setShowPaidPlanNotice(true);
      return;
    }
    try {
      localStorage.setItem("has_subscription", "false");
      localStorage.setItem("plan_tier", "freemium");
    } catch {}
    if (typeof props?.setShowPlans === "function") {
      props.setShowPlans(false);
    }
    navigate(ENUMFORROUTES.DASHBOARD);
  }, [navigate, props?.setShowPlans]);

  const normalizeUserRecord = useCallback(
    (raw: any) => {
      if (!raw) return null;
      const candidateUserId =
        raw.user_id ??
        raw.userId ??
        raw.userID ??
        raw.id ??
        raw.ID ??
        raw.uuid ??
        raw.uid ??
        raw.username ??
        raw.cognito_username ??
        raw.cognitoUsername ??
        tokenClaims?.["custom:user_id"] ??
        tokenClaims?.["custom:userId"] ??
        tokenClaims?.["cognito:username"] ??
        tokenClaims?.username ??
        tokenClaims?.sub;

      const candidateCustomerId =
        raw.customer_id ??
        raw.customerId ??
        raw.customerID ??
        raw.stripe_customer_id ??
        raw.stripeCustomerId ??
        raw.stripe_customerId ??
        raw.stripeCustomerID ??
        raw.stripe_cust_id ??
        raw.stripeCustId;

      const normalized = { ...raw };
      if (candidateUserId) normalized.user_id = candidateUserId;
      if (candidateCustomerId) normalized.customer_id = candidateCustomerId;
      return normalized;
    },
    [tokenClaims]
  );

  useEffect(() => {
    if (!isNullUndefinedOrBlank(props?.state)) {
      setuserData(normalizeUserRecord(props?.state));
    } else {
      setuserData(null);
    }
  }, [props?.state, normalizeUserRecord]);

  // Fallback: if no state provided (e.g., opened from Settings), use saved login data if available
  useEffect(() => {
    if (!userData && !isNullUndefinedOrBlank(savedLoginData)) {
      setuserData(normalizeUserRecord(savedLoginData));
    }
  }, [savedLoginData, userData, normalizeUserRecord]);

  // Fallback: if user is logged in but we don't have userData, fetch it from API
  useEffect(() => {
    const fetchUserIfLoggedIn = async () => {
      const token = getToken();
      if (token && !userData && isNullUndefinedOrBlank(props?.state) && isNullUndefinedOrBlank(savedLoginData)) {
        try {
          const resp: any = await dispatch<any>(getUserAPI());
          const payload = resp?.payload || resp;
          if (payload) {
            setuserData(normalizeUserRecord(payload));
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserIfLoggedIn();
  }, [dispatch, userData, props?.state, savedLoginData, normalizeUserRecord]);

  useEffect(() => {
    if (!isNullUndefinedOrBlank(props?.currentProductId)) {
      setSelectedPlan(props?.currentProductId);
    }
  }, [props?.currentProductId]);

  // Fetch subscription status to determine the active plan
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const token = getToken();
      // Always fetch if logged in and no plan selected yet
      if (token && !selectedPlan) {
        try {
          const resp: any = await dispatch<any>(getSubscriptionStatusAPI());
          const payload = resp?.payload || resp;
          const isSubscription = payload?.isSubscription === true;
          const plan = payload?.plan || {};
          const planCode = plan?.plan_code || '';
          
          console.log('[PricePlans] Subscription status:', { isSubscription, planCode, plan });
          
          // Determine the correct product_id to select
          let productIdToSelect: string | null = null;
          
          if (!isSubscription || planCode === 'freemium') {
            // User is on free plan
            productIdToSelect = 'freemium';
          } else if (plan?.product_id) {
            productIdToSelect = plan.product_id;
          } else if (planCode === '1m') {
            productIdToSelect = 'one_month';
          } else if (planCode === '6m') {
            productIdToSelect = 'six_month';
          } else if (planCode === '1y') {
            productIdToSelect = 'one_year';
          } else if (plan?.plan_type) {
            // Fallback: try to match plan_type to product_id
            const planType = plan.plan_type?.toLowerCase() || '';
            if (planType.includes('6 month') || planType.includes('six month')) {
              productIdToSelect = 'six_month';
            } else if (planType.includes('1 year') || planType.includes('annual') || planType.includes('one year')) {
              productIdToSelect = 'one_year';
            } else if (planType.includes('1 month') || planType.includes('one month')) {
              productIdToSelect = 'one_month';
            } else if (planType.includes('free') || planType.includes('freemium')) {
              productIdToSelect = 'freemium';
            }
          }
          
          console.log('[PricePlans] Setting selectedPlan to:', productIdToSelect);
          
          if (productIdToSelect) {
            setSelectedPlan(productIdToSelect);
          }
        } catch (error) {
          console.error("Failed to fetch subscription status:", error);
          // Fallback: check localStorage
          try {
            const hasSub = localStorage.getItem('has_subscription') === 'true';
            if (!hasSub) {
              setSelectedPlan('freemium');
            }
          } catch {}
        }
      }
    };
    fetchSubscriptionStatus();
  }, [dispatch, selectedPlan]);

  // no need to mirror updatePlan into local state
  // console.log("userData", userData)

  //const openInNewTab = (url) => {
  //const a = document.createElement("a");
  //a.href = url;
  //a.target = "_blank";
  //a.rel = "noopener noreferrer";
  //document.body.appendChild(a);
  // a.click();
  // a.remove();
  // }; removed helper

  const handleGetStarted = async (plan) => {
    // Check if user is actually logged in
    const token = getToken();
    
    // For upgrade flow (from Settings), allow BE to derive user from auth even if userData is missing
    if (!userData && !props?.upgradeNoTrial) {
      // If user has a token, try to fetch user data first
      if (token) {
        try {
          const resp: any = await dispatch<any>(getUserAPI());
          const payload = resp?.payload || resp;
          if (payload) {
            const normalized = normalizeUserRecord(payload);
            setuserData(normalized);
            // Continue with the normalized user data
            await processGetStarted(plan, normalized);
            return;
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      // Only show login error if there's no token
      te("Please Login First!!");
      navigate(ENUMFORROUTES.LOGIN);
      return;
    }
    
    await processGetStarted(plan, userData);
  };

  const processGetStarted = async (plan: any, currentUserData: any) => {
    if (isFreemiumPlan(plan)) {
      // Only block freemium selection if user is on a PAID plan
      if (hasSubscriptionFlag) {
        setShowPaidPlanNotice(true);
        return;
      }
      // If already on freemium, don't do anything (button should be disabled anyway)
      if (selectedPlan === 'freemium' || selectedPlan === plan?.product_id) {
        return;
      }
      handleFreemiumEntry();
      return;
    }

    // For upgrades (managed_by_parent), prefer BE inference but include IDs when available
    // to be backward compatible with older deployments that still require them.
    let ensuredUser = normalizeUserRecord(currentUserData);
    if (ensuredUser) {
      setuserData(ensuredUser);
    }

    const hasSubscription = (() => {
      try {
        return localStorage.getItem("has_subscription") === "true";
      } catch {
        return false;
      }
    })();

    if (
      hasSubscription &&
      (!ensuredUser?.user_id || !ensuredUser?.customer_id)
    ) {
      try {
        const resp: any = await dispatch<any>(getUserAPI());
        const payload = resp?.payload || resp;
        if (payload) {
          const normalized = normalizeUserRecord({
            ...(ensuredUser || {}),
            ...payload,
          });
          ensuredUser = normalized || ensuredUser;
          if (normalized) {
            setuserData(normalized);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }

    // Validate that we have user_id before proceeding
    if (!ensuredUser?.user_id) {
      te(
        "We're still loading your account details. Please log out and back in, then try again."
      );
      return;
    }

    let reqBody: any = {
      product_id: plan.product_id,
      price: plan.price.toString(),
      user_id: ensuredUser.user_id, // Always include user_id (now guaranteed to exist)
      ...(props?.upgradeNoTrial
        ? { no_trial: true, student_upgrade: true }
        : {}),
    };

    // Always include customer_id when available for maximum compatibility across BE envs
    if (ensuredUser?.customer_id) {
      reqBody.customer_id = ensuredUser.customer_id;
      reqBody.stripe_customer_id = ensuredUser.customer_id;
    }

    const response = await dispatch(createCheckOutAPI(reqBody));
    if (response) {
      setTimeout(() => {
        if (response?.payload?.url) {
          window.open(response.payload.url, "_blank");
        }
      }, 100);
    }
  };

  const handleUpdatePlan = async (product_id) => {
    let reqBody = { product_id };
    setloading(true);
    const response = await dispatch(updatePlanAPI(reqBody));
    if (response) {
      setTimeout(() => {
        props?.getTransactionList();
        handleConfirmationClose();
        props?.setShowPlans(false);
      }, 300);
      setPlan(null);
    }
    setloading(false);
  };

  const [completeConfirmationShow, setCompleteConfirmationShow] =
    useState(false);
  const [plan, setPlan] = useState<any>(null);
  const handleConfirmationClose = () => {
    setPlan(null);
    setCompleteConfirmationShow(false);
  };
  const handleConfirmationShow = (plan) => {
    setPlan(plan);
    setCompleteConfirmationShow(true);
  };
  const [loading, setloading] = useState(false);

  /** --------------get plans start------------------------------*/
  const [plans, setPlans] = useState<any>([]);
  const fallbackPlans: any[] = useMemo(
    () => [
      {
        product_id: "one_month",
        title: "1 Month",
        price: 3.99,
        Stripe_id: "for 1 month",
        duration: "for 1 month",
        features: [
          "Unlimited syllabus uploads",
          "Full website access",
          "Full mobile application access",
          "Notifications",
        ],
      },
      {
        product_id: "six_month",
        title: "6 Months",
        price: 14.99,
        Stripe_id: "for 6 month",
        duration: "for 6 months",
        features: [
          "Unlimited syllabus uploads",
          "Full website access",
          "Full mobile application access",
          "Notifications",
        ],
      },
      {
        product_id: "one_year",
        title: "1 Year",
        price: 23.99,
        Stripe_id: "for 1 year",
        duration: "for 1 year",
        features: [
          "Unlimited syllabus uploads",
          "Full website access",
          "Full mobile application access",
          "Notifications",
        ],
      },
    ],
    []
  );

  const getPlansAPI = useCallback(async () => {
    /** --------------get plans start------------------------------*/
    let reqBody = {
      payment_method: "Stripe",
    };
    const response = await dispatch(getAllPlanAPI(reqBody));
    if (response?.payload) {
      let list = Array.isArray(response.payload) ? [...response.payload] : [];
      // Ensure we always render three plans in UI
      if (list.length < 3) {
        const existing = new Set(list.map((p: any) => p.product_id));
        for (const p of fallbackPlans) {
          if (!existing.has(p.product_id)) list.push(p);
          if (list.length === 3) break;
        }
      }
      list = ensureFreemiumPlan(list);
      // sort by price ascending for consistent order
      list.sort((a: any, b: any) => Number(a.price) - Number(b.price));
      setPlans(list);
    } else {
      setPlans(ensureFreemiumPlan([...fallbackPlans]));
    }
  }, [dispatch, fallbackPlans]);

  useEffect(() => {
    getPlansAPI();
  }, [getPlansAPI]);

  /** --------------get plans end------------------------------*/

  // Helper to get duration label
  const getDurationLabel = (plan: any, freemium: boolean) => {
    if (freemium) return "Free";
    if (plan.duration === "for 1 month") return "1 Month";
    if (plan.duration === "for 6 month") return "6 Months";
    if (plan.duration === "for 1 year") return "1 Year";
    return plan.title || plan.duration || "";
  };

  // Helper to get price per month
  const getPricePerMonth = (plan: any) => {
    if (plan.duration === "for 6 month") return "$2.50/month";
    if (plan.duration === "for 1 year") return "$2.00/month";
    return null;
  };

  // Check icon SVG component
  const CheckIcon = () => (
    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="price-plans-wrapper">
      <div className="price-plans-header">
        <h2>Choose Your Plan</h2>
        <p>Select the plan that works best for you</p>
      </div>

      <div className="price-plans-grid">
        {plans.map((plan, index) => {
          const freemium = isFreemiumPlan(plan);
          const originalPrice = undiscountedMap[plan.duration];
          const isPopular = !freemium && plan.duration === "for 6 month";
          const isBestValue = !freemium && plan.duration === "for 1 year";
          // Only block freemium selection if user is on a PAID plan
          const freemiumBlocked = freemium && hasSubscriptionFlag;
          const isActivePlan = selectedPlan === plan?.product_id;
          // Show "Change Plan" if user has subscription (either via prop or localStorage flag)
          const isChangeMode = props?.updatePlan || hasSubscriptionFlag;
          const buttonText = isActivePlan
            ? "Current"
            : freemium
              ? "Start for Free"
              : isChangeMode
                ? "Change Plan"
                : "Get Started";
          const pricePerMonth = getPricePerMonth(plan);

          return (
            <div
              key={index}
              className={`price-plan-card ${isActivePlan ? "active" : ""} ${isPopular ? "popular" : ""} ${isBestValue ? "best-value" : ""}`}
            >
              {isPopular && (
                <span className="plan-badge popular-badge">Popular</span>
              )}
              {isBestValue && (
                <span className="plan-badge best-value-badge">Best Value</span>
              )}

              <div className="plan-header">
                <span className="plan-duration">{getDurationLabel(plan, freemium)}</span>
                <div className="plan-price">
                  <span className={`plan-price-old ${!originalPrice || freemium ? "plan-price-old-hidden" : ""}`}>
                    {originalPrice ? `$${originalPrice}` : "\u00A0"}
                  </span>
                  <span className="plan-price-current">
                    {freemium ? "$0" : `$${plan.price}`}
                  </span>
                  <span className={`plan-price-per-month ${!pricePerMonth ? "plan-price-per-month-hidden" : ""}`}>
                    {pricePerMonth || "\u00A0"}
                  </span>
                </div>
              </div>

              <button
                className={`plan-btn ${isActivePlan ? "active-plan" : ""}`}
                disabled={isActivePlan}
                onClick={() => {
                  if (isActivePlan) return;
                  if (freemiumBlocked) {
                    setShowPaidPlanNotice(true);
                    return;
                  }
                  // If user has subscription, redirect to Stripe billing portal
                  if (isChangeMode && !freemium) {
                    window.location.assign(
                      'https://billing.stripe.com/p/login/bJedR99D8gNU2Qj0iKbfO00'
                    );
                    return;
                  }
                  handleGetStarted(plan);
                }}
              >
                {buttonText}
              </button>

              <div className="plan-features">
                <span className="plan-features-label">FEATURES</span>
                <ul>
                  {plan.features.map((feature: string, i: number) => {
                    const normalized =
                      typeof feature === "string" &&
                      feature.trim().toLowerCase() === "full mobile application access"
                        ? "Full mobile application access"
                        : feature;
                    return (
                      <li key={i}>
                        <CheckIcon />
                        {normalized}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        className="modal-theme"
        show={showPaidPlanNotice}
        onHide={() => setShowPaidPlanNotice(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Already on a paid plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            You’re currently on a paid subscription. To move to the free tier,
            cancel your subscription first. Once it expires, you’ll
            automatically revert to Free.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowPaidPlanNotice(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowPaidPlanNotice(false);
              navigate(ENUMFORROUTES.SETTINGS);
            }}
          >
            Go to Billing
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="modal-theme modal-confirmation modal-approve"
        show={completeConfirmationShow}
        onHide={handleConfirmationClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">Change Plan</h4>
          <button
            type="button"
            className="btn-close"
            onClick={handleConfirmationClose}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-confirmation-container">
            <div className="modal-confirmation-icon">
              <i className="material-symbols-outlined">check_circle</i>
            </div>
            <div className="modal-confirmation-content">
              <h5>Are You Sure ?</h5>
              <p>Do you want to proceed?</p>
            </div>
          </div>
          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            <Button
              variant="light-white"
              className="btn-icon-text btn-md"
              onClick={handleConfirmationClose}
            >
              {" "}
              Cancel
            </Button>
            <Button
              variant="primary"
              className="btn-icon-text btn-md"
              onClick={() => {
                handleUpdatePlan(plan?.product_id);
              }}
            >
              {" "}
              Ok
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {loading && (
        <div className="price-plans-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};
