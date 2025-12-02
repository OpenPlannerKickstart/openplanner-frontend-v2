import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import {
  ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT,
  ENUMFORROUTES,
} from "../../interfaces/enum";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { createCheckOutAPI } from "../../redux/Service/auth/signup";
import { getDecodeIDToken, isNullUndefinedOrBlank } from "../../Utility/Helper";
import {
  getAllPlanAPI,
  updatePlanAPI,
  getUserAPI,
} from "../../redux/Service/User/Settings/settings";
import { te } from "../../Utility/Toaster";

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
  duration: "Free forever",
  features: [
    "Upload 1 syllabus",
    "Web and mobile access",
    "Basic reminders and notifications",
  ],
  is_freemium: true,
};

const isFreemiumPlan = (plan: any): boolean => {
  const price = typeof plan?.price === "string" ? parseFloat(plan.price) : plan?.price;
  return (
    plan?.is_freemium === true ||
    plan?.product_id === "freemium" ||
    (typeof price === "number" && !isNaN(price) && price <= 0)
  );
};

const ensureFreemiumPlan = (list: any[]) => {
  const hasFreemium = Array.isArray(list) && list.some(isFreemiumPlan);
  if (!hasFreemium) {
    list.unshift({ ...FREEMIUM_PLAN });
  }
  return list;
};

export const PricePlans = (props) => {
  const [userData, setuserData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  useEffect(() => {
    if (!isNullUndefinedOrBlank(props?.currentProductId)) {
      setSelectedPlan(props?.currentProductId);
    }
  }, [props?.currentProductId]);

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
    // For upgrade flow (from Settings), allow BE to derive user from auth even if userData is missing
    if (!userData && !props?.upgradeNoTrial) {
      te("Please Login First!!");
      navigate(ENUMFORROUTES.LOGIN);
      return;
    }

    if (isFreemiumPlan(plan)) {
      handleFreemiumEntry();
      return;
    }

    // For upgrades (managed_by_parent), prefer BE inference but include IDs when available
    // to be backward compatible with older deployments that still require them.
    let ensuredUser = normalizeUserRecord(userData);
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

  return (
    <div className="pricing-wrapper">
      <Row className="g-3 g-lg-4 row-cols-1 row-cols-md-3 justify-content-between px-3 px-md-4">
        {plans.map((plan, index) => {
          const freemium = isFreemiumPlan(plan);
          const originalPrice = undiscountedMap[plan.duration];
          const displayDuration =
            freemium ||
            !fallbackPlans.find((fb) => fb.Stripe_id === plan.duration)
              ? plan.duration || "Free forever"
              : fallbackPlans.find((fb) => fb.Stripe_id === plan.duration)
                  ?.duration || plan.duration;
          const isActivePlan = selectedPlan === plan?.product_id;
          const disableFreemiumChange =
            (props?.updatePlan || props?.upgradeNoTrial) && freemium;
          const buttonText = freemium
            ? isActivePlan
              ? "Active"
              : disableFreemiumChange
                ? "Unavailable"
                : "Start for Free"
            : isActivePlan
              ? "Active"
              : props?.updatePlan
                ? "Change Plan"
                : "Get Started";

          return (
            <Col key={index}>
              <Card
                className={`pricing-card ${
                  selectedPlan === plan?.product_id ? "active" : ""
                }`}
              >
                <Card.Header>
                  {!freemium && plan.duration === "for 1 year" && (
                    <span className="popular-tag">Popular</span>
                  )}
                </Card.Header>
                <Card.Body>
                  <div className="price-section">
                    {!freemium && originalPrice && (
                      <div>
                        <span className="original-price">
                          ${originalPrice}
                        </span>
                      </div>
                    )}
                    <span className="price">
                      {freemium ? "Free" : `$${plan.price}`}
                    </span>
                    <span className="duration">{displayDuration}</span>
                  </div>

                  <Button
                    variant="primary"
                    disabled={isActivePlan || disableFreemiumChange}
                    className="btn-text w-100 mb-4"
                    onClick={() => {
                      if (isActivePlan || disableFreemiumChange) return;
                      if (props?.updatePlan && !props?.upgradeNoTrial) {
                        handleConfirmationShow(plan);
                      } else {
                        handleGetStarted(plan);
                      }
                    }}
                  >
                    {buttonText}
                  </Button>

                  {/* <Button variant="primary" disabled={selectedPlan === plan?.product_id} className="btn-text w-100 mb-4" onClick={() => { isUpdatePlan ? handleUpdatePlan(plan?.product_id) : handleGetStarted(plan) }} > Get started */}
                  {/* </Button> */}
                  <div className="divider"></div>
                  <div className="features-section">
                    <h4>FEATURES</h4>
                    <ul>
                      {plan.features.map((feature, i) => {
                        const normalized =
                          typeof feature === "string" &&
                          feature.trim().toLowerCase() ===
                            "full mobile application access"
                            ? "Full mobile application access"
                            : feature;
                        return (
                          <li key={i}>
                            <i className="material-symbols-outlined check-icon">
                              check_circle
                            </i>{" "}
                            {normalized}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

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
        <div className="loader-container">
          <svg
            className="inner-container"
            viewBox="0 0 35 35"
            height="35"
            width="35"
          >
            <rect
              className="track"
              x="2.5"
              y="2.5"
              fill="none"
              stroke-width="5px"
              width="32.5"
              height="32.5"
            />
            <rect
              className="car"
              x="2.5"
              y="2.5"
              fill="none"
              stroke-width="5px"
              width="32.5"
              height="32.5"
              pathLength="100"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
