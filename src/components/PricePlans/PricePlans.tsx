import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT, ENUMFORROUTES } from '../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckOutAPI } from '../../redux/Service/auth/signup';
import { isNullUndefinedOrBlank } from '../../Utility/Helper';
import { getAllPlanAPI, updatePlanAPI, getUserAPI } from '../../redux/Service/User/Settings/settings';
import { te } from '../../Utility/Toaster';


// const plans = [
//   {
//     title: "7 Day Free Trial",
//     price: ENUM_FOR_PLAN_AMOUNT.SIX_MONTH,
//     product_id: ENUM_FOR_PLAN_ID.SIX_MONTH,
//     duration: "for 6 months",
//     features: [
//       "Unlimited syllabus uploads",
//       "Full website access",
//       "Full mobile application access",
//       "Notifications",
//     ],
//   },
//   {
//     title: "7 Day Free Trial",
//     price: ENUM_FOR_PLAN_AMOUNT.ONE_YEAR,
//     product_id: ENUM_FOR_PLAN_ID.ONE_YEAR,
//     duration: "for 1 year",
//     features: [
//       "Unlimited syllabus uploads",
//       "Full website access",
//       "Full mobile application access",
//       "Notifications",
//     ],
//   },
//   {
//     title: "7 Day Free Trial",
//     price: ENUM_FOR_PLAN_AMOUNT.TWO_YEAR,
//     product_id: ENUM_FOR_PLAN_ID.TWO_YEAR,
//     duration: "for 2 years",
//     features: [
//       "Unlimited syllabus uploads",
//       "Full website access",
//       "Full mobile application access",
//       "Notifications",
//     ],
//   },
// ];

// console.log(plans)

const undiscountedMap = {
  "for 1 month": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.ONE_MONTH,
  "for 6 month": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.SIX_MONTH,
  "for 1 year": ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT.ONE_YEAR,
};

export const PricePlans = (props) => {
  const [userData, setuserData] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  // rely directly on props.updatePlan instead of local state to avoid initial-render race
  const dispatch: AppDispatch = useDispatch();
  const savedLoginData = useSelector((state: any) => state?.SignupReducer?.savedLoginData);
  // removed unused local modal states; using explicit confirmation modal already below
  const navigate = useNavigate();

  useEffect(() => {

    if (!isNullUndefinedOrBlank(props?.state)) {
      setuserData(props?.state)
    } else {
      setuserData(null);
    }

  }, [props?.state])

  // Fallback: if no state provided (e.g., opened from Settings), use saved login data if available
  useEffect(() => {
    if (!userData && !isNullUndefinedOrBlank(savedLoginData)) {
      setuserData(savedLoginData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLoginData])

  useEffect(() => {
    if (!isNullUndefinedOrBlank(props?.currentProductId)) {
      setSelectedPlan(props?.currentProductId)
    }
  }, [props?.currentProductId])



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
      navigate(ENUMFORROUTES.LOGIN)
      return;
    }

    // For upgrades (managed_by_parent), prefer BE inference but include IDs when available
    // to be backward compatible with older deployments that still require them.
    let ensuredUser = userData;
    if ((!ensuredUser?.user_id || !ensuredUser?.customer_id)) {
      try {
        const resp: any = await dispatch<any>(getUserAPI());
        const payload = resp?.payload || resp;
        if (payload) {
          ensuredUser = {
            user_id: payload?.id || payload?.user_id,
            customer_id: payload?.stripe_customer_id || payload?.customer_id,
          };
          setuserData((prev) => ({ ...prev, ...ensuredUser }));
        }
      } catch {}
    }

    let reqBody: any = {
      product_id: plan.product_id,
      price: plan.price.toString(),
      ...(props?.upgradeNoTrial ? { no_trial: true, student_upgrade: true } : {})
    };
    // Always include IDs when available for maximum compatibility across BE envs
    if (ensuredUser?.user_id) (reqBody as any).user_id = ensuredUser.user_id;
    if (ensuredUser?.customer_id) {
      (reqBody as any).customer_id = ensuredUser.customer_id;
      (reqBody as any).stripe_customer_id = ensuredUser.customer_id;
    }
    // console.log(reqBody, "reqBody", decrypted(userData?.customer_id))
    const response = await dispatch(createCheckOutAPI(reqBody));
    if (response) {
      // if (response.payload.url) {
      //   window.open(response.payload.url, "_blank");
      // }
      setTimeout(() => {
        if (response?.payload?.url) {
          window.open(response.payload.url, "_blank");
        }
      }, 100);
      // window.location.href = response.payload.url
      // window.open(response.payload.url, '_blank', 'noopener,noreferrer');
      // navigate(response?.payload?.url)
    }

  }

  const handleUpdatePlan = async (product_id) => {
    let reqBody = { product_id }
    setloading(true);
    const response = await dispatch(updatePlanAPI(reqBody));
    if (response) {
      setTimeout(() => {
        props?.getTransactionList();
        handleConfirmationClose();
        props?.setShowPlans(false);
      }, 300);
      setPlan(null)
    }
    setloading(false)
  }




  const [completeConfirmationShow, setCompleteConfirmationShow] = useState(false);
  const [plan, setPlan] = useState<any>(null)
  const handleConfirmationClose = () => {
    setPlan(null);
    setCompleteConfirmationShow(false);
  }
  const handleConfirmationShow = (plan) => { setPlan(plan); setCompleteConfirmationShow(true); }
  const [loading, setloading] = useState(false)



  /** --------------get plans start------------------------------*/
  const [plans, setPlans] = useState<any>([]);
  const fallbackPlans: any[] = React.useMemo(() => ([
    { product_id: 'one_month', title: '1 Month', price: 3.99, Stripe_id: 'for 1 month', duration: 'for 1 month', features: ['Unlimited syllabus uploads', 'Full website access', 'Full mobile application access', 'Notifications'] },
    { product_id: 'six_month', title: '6 Months', price: 14.99, Stripe_id: 'for 6 month', duration: 'for 6 months', features: ['Unlimited syllabus uploads', 'Full website access', 'Full mobile application access', 'Notifications'] },
    { product_id: 'one_year', title: '1 Year', price: 23.99, Stripe_id: 'for 1 year', duration: 'for 1 year', features: ['Unlimited syllabus uploads', 'Full website access', 'Full mobile application access', 'Notifications'] },
  ]), []);

  const getPlansAPI = useCallback(async () => {
    /** --------------get plans start------------------------------*/
    let reqBody = {
      payment_method: "Stripe"
    }
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
      // sort by price ascending for consistent order
      list.sort((a: any, b: any) => Number(a.price) - Number(b.price));
      setPlans(list);
    }
  }, [dispatch, fallbackPlans])

  useEffect(() => {
    getPlansAPI();
  }, [getPlansAPI])


  /** --------------get plans end------------------------------*/


  return (
    <div className="pricing-wrapper">
      <Row className="g-3 g-lg-4 row-cols-1 row-cols-md-3 justify-content-between px-3 px-md-4">
        {plans.map((plan, index) => {
          return (
          <Col key={index}>
            <Card className={`pricing-card ${selectedPlan === plan?.product_id ? 'active' : ''}`}>
              <Card.Header>
                {plan.duration === 'for 1 year' && (
                  <span className="popular-tag">Popular</span>
                )}
            </Card.Header>
              <Card.Body>
                <div className="price-section">
                  <div >
                    <span className="original-price">${undiscountedMap[plan.duration]}</span>
                  </div>
                  <span className="price">${plan.price}</span>
                  <span className="duration">
                    {fallbackPlans.find(fb => fb.Stripe_id === plan.duration)?.duration || plan.duration}
                  </span>
                </div>

                <Button
                  variant="primary"
                  // disabled={selectedPlan === plan?.product_id}
                  className="btn-text w-100 mb-4"
                  onClick={() => {  
                    if (selectedPlan === plan?.product_id) return;
                if (props?.updatePlan && !props?.upgradeNoTrial) {
                      handleConfirmationShow(plan)
                    } else {
                      handleGetStarted(plan);
                    }
                  }}
                >
                  {selectedPlan === plan?.product_id ? "Active" : props?.updatePlan ? "Change Plan" : "Get Started"}

                </Button>

                {/* <Button variant="primary" disabled={selectedPlan === plan?.product_id} className="btn-text w-100 mb-4" onClick={() => { isUpdatePlan ? handleUpdatePlan(plan?.product_id) : handleGetStarted(plan) }} > Get started */}
                {/* </Button> */}
                <div className="divider"></div>
                <div className="features-section">
                  <h4>FEATURES</h4>
                  <ul>
                    {plan.features.map((feature, i) => {
                      const normalized = (typeof feature === 'string' && feature.trim().toLowerCase() === 'full mobile application access') ? 'Full mobile application access' : feature;
                      return (
                        <li key={i}>
                          <i className="material-symbols-outlined check-icon">check_circle</i> {normalized}
                        </li>
                      );
                    })}

                  </ul>
                    
                </div>
              </Card.Body>
            </Card>
          </Col>
        )})}
      </Row>

      <Modal className='modal-theme modal-confirmation modal-approve' show={completeConfirmationShow} onHide={handleConfirmationClose} centered>
        <Modal.Header >
          <h4 className="modal-title">Change Plan</h4>
          <button type="button" className="btn-close" onClick={handleConfirmationClose}>
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
            <Button variant="light-white"
              className="btn-icon-text btn-md" onClick={handleConfirmationClose}> Cancel
            </Button>
            <Button variant="primary"
              className="btn-icon-text btn-md" onClick={() => { handleUpdatePlan(plan?.product_id) }}> Ok
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {loading && (
        <div className="loader-container">
          <svg className="inner-container" viewBox="0 0 35 35" height="35" width="35">
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
    </div >
  )
}
