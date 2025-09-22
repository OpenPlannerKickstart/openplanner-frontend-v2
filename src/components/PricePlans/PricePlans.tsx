import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { ENUM_FOR_PLAN_AMOUNT, ENUM_FOR_UNDISCOUNTED_PLAN_AMOUNT, ENUM_FOR_PLAN_ID, ENUMFORROUTES } from '../../interfaces/enum';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { createCheckOutAPI } from '../../redux/Service/auth/signup';
import { decrypted, isNullUndefinedOrBlank } from '../../Utility/Helper';
import { getAllPlanAPI, updatePlanAPI } from '../../redux/Service/User/Settings/settings';
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

  const [isUpdatePlan, setisUpdatePlan] = useState(false)
  const dispatch: AppDispatch = useDispatch();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    if (!isNullUndefinedOrBlank(props?.state)) {
      setuserData(props?.state)
    } else {
      setuserData(null);
    }

  }, [props?.state])

  useEffect(() => {
    if (!isNullUndefinedOrBlank(props?.currentProductId)) {
      setSelectedPlan(props?.currentProductId)
    }
  }, [props?.currentProductId])



  useEffect(() => {

    if (!isNullUndefinedOrBlank(props?.updatePlan)) {
      setisUpdatePlan(true)
    } else {
      setisUpdatePlan(false);
    }

  }, [props?.updatePlan])
  // console.log("userData", userData)

  const openInNewTab = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handleGetStarted = async (plan) => {
    if (!userData) {
      te("Please Login First!!");
      navigate(ENUMFORROUTES.LOGIN)
      return;
    }

    let reqBody = {
      user_id: userData?.user_id,
      customer_id: userData?.customer_id,
      product_id: plan.product_id,
      price: plan.price.toString()
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

  const getPlansAPI = async () => {
    /** --------------get plans start------------------------------*/
    let reqBody = {
      payment_method: "Stripe"
    }
    const response = await dispatch(getAllPlanAPI(reqBody));
    if (response?.payload) {
      setPlans(response?.payload)
    }
  }

  useEffect(() => {
    getPlansAPI();
  }, [])


  /** --------------get plans end------------------------------*/


  return (
    <div className="pricing-wrapper">
      <Row>
        {plans.map((plan, index) => (
          <Col xs={12} md={plans?.length == 4 ? 3 : 4} key={index}>
            <Card className={`pricing-card ${selectedPlan === plan?.product_id ? 'active' : ''}`}>
              <Card.Header>
                <span className="trial-label">{plan.title}</span>
                <span className="popular-tag">Popular</span>
              </Card.Header>
              <Card.Body>
                <div className="price-section">
                  <div >
                    <span className="original-price">${undiscountedMap[plan.duration]}</span> for {plan.duration}
                  </div>
                  <span className="price">${plan.price}</span>
                  <span className="duration">{plan.duration}</span>
                </div>

                <Button
                  variant="primary"
                  // disabled={selectedPlan === plan?.product_id}
                  className="btn-text w-100 mb-4"
                  onClick={() => {
                    if (selectedPlan === plan?.product_id) return;
                    if (isUpdatePlan) {
                      handleConfirmationShow(plan)
                    } else {
                      handleGetStarted(plan);
                    }
                  }}
                >
                  {selectedPlan === plan?.product_id ? "Active" : isUpdatePlan ? "Change Plan" : "Get Started"}

                </Button>

                {/* <Button variant="primary" disabled={selectedPlan === plan?.product_id} className="btn-text w-100 mb-4" onClick={() => { isUpdatePlan ? handleUpdatePlan(plan?.product_id) : handleGetStarted(plan) }} > Get started */}
                {/* </Button> */}
                <div className="divider"></div>
                <div className="features-section">
                  <h4>FEATURES</h4>
                  <ul>
                    {(plan.duration === "for 6 month" || plan.duration === "for 1 year") && (
                      <li>
                        <i className="material-symbols-outlined free-check-icon"

                        >
                          check_circle</i> 1 week free trial
                      </li>
                    )}
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <i className="material-symbols-outlined check-icon">check_circle</i> {feature}
                      </li>
                    ))}
                  </ul>
                    
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
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
