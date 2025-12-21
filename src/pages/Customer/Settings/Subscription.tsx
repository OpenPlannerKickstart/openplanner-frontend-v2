import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { PricePlans } from "../../../components/PricePlans/PricePlans";
import {
  cancelSubscriptionAPI,
  getTransactionAPI,
  getSubscriptionStatusAPI,
  studentBillingPortalAPI,
} from "../../../redux/Service/User/Settings/settings";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  formatedDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
} from "../../../Utility/Helper";

// import { useNavigate } from 'react-router-dom';
import { ENUMFORACCOUNTTAB } from "../../../interfaces/enum";

interface SubscriptionProps {
  selectedTab: string;
}

export const Subscription: React.FC<SubscriptionProps> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const transactionDataRedux: any = useSelector(
    (state: RootState) => state.SettingsReducer.billingData
  );
  const [transactionData, setTransactionData] = useState<any>();
  const [showPlans, setShowPlans] = useState(false);
  const [statusPlan, setStatusPlan] = useState<any | null>(null);
  const [plansMode, setPlansMode] = useState<"update" | "upgrade">("update");

  const getTransactionList = async () => {
    await dispatch(getTransactionAPI());
    // if (!isNullUndefinedOrBlank(response?.payload)) {
    //     setTransactionData(JSON.parse(JSON.stringify(response?.payload))); // Save deep-cloned data to state
    // }
  };

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(transactionDataRedux)) {
      setTransactionData(JSON.parse(JSON.stringify(transactionDataRedux))); // Save deep-cloned data to state
    }
  }, [transactionDataRedux]);

  useEffect(() => {
    if (props?.selectedTab === ENUMFORACCOUNTTAB.SUBSCRIPTION) {
      setShowPlans(false);
      setTimeout(() => {
        getTransactionList();
      }, 200);
      // Also fetch canonical subscription status to normalize UI
      (async () => {
        try {
          const resp: any = await dispatch<any>(getSubscriptionStatusAPI());
          const payload = resp?.payload || resp;
          const plan = payload?.plan || payload; // BE returns { plan: {...} }
          if (plan && typeof plan === "object") setStatusPlan(plan);
          else setStatusPlan(null);
        } catch {
          setStatusPlan(null);
        }
      })();
    }

    // eslint-disable-next-line
  }, [props?.selectedTab]);

  useEffect(() => {
    if (showPlans === false) {
      getTransactionList();
    }
    // eslint-disable-next-line
  }, [showPlans]);
  // const navigate = useNavigate();
  const handleCancelSubscription = async () => {
    const response = await dispatch(cancelSubscriptionAPI());
    if (!isNullUndefinedOrBlank(response?.payload)) {
      handleDeleteClose();
      // await dispatch(logoutFromSystem());
      // logoutFromSystem("Plan Cancelled successfully!!");
      // navigate(ENUMFORROUTES.LOGIN)
    }
  };

  const [deleteShow, setDeleteShow] = useState(false);
  const normalizePlanLabel = (label?: string): string => {
    const raw = (label || "").toString().trim().toLowerCase();
    if (!raw) return "-";
    if (raw.includes("freemium") || raw === "free") return "Free";
    // common variants from BE or legacy data
    if (raw.includes("1 month")) return "One Month";
    if (raw.includes("6 month")) return "Six Month";
    if (
      raw.includes("12 month") ||
      raw.includes("1 year") ||
      raw.includes("one year") ||
      raw.includes("annual")
    )
      return "Annual";
    // already nice names, just capitalize first letter
    return label as string;
  };

  const computed = {
    managedByParent: statusPlan?.managed_by_parent === true,
    planLabel: (() => {
      const localTier = (() => {
        try {
          return localStorage.getItem("plan_tier");
        } catch {
          return null;
        }
      })();
      if (statusPlan?.plan_tier === "freemium" || localTier === "freemium")
        return "Free";
      if (
        typeof statusPlan?.display_label === "string" &&
        statusPlan.display_label.trim()
      )
        return statusPlan.display_label;
      return normalizePlanLabel(transactionData?.currentPlan?.plan_type);
    })(),
    paymentAmount: (() => {
      const localTier = (() => {
        try {
          return localStorage.getItem("plan_tier");
        } catch {
          return null;
        }
      })();
      if (statusPlan?.plan_tier === "freemium" || localTier === "freemium")
        return 0;
      if (statusPlan && typeof statusPlan.payment_amount === "number")
        return statusPlan.payment_amount;
      return !isNullUndefinedOrBlank(transactionData?.currentPlan?.amount)
        ? transactionData?.currentPlan?.amount
        : "-";
    })(),
    nextInvoiceDate: (() => {
      const next =
        statusPlan?.next_invoice_date ||
        transactionData?.currentPlan?.next_billing_date;
      return !isNullUndefinedOrBlank(next)
        ? formatedDate(next, "DD MMM, YYYY")
        : "-";
    })(),
    subscriptionStatus:
      statusPlan?.subscription_status ||
      transactionData?.currentPlan?.subscription_status ||
      "-",
    currentPeriodEnd: (() => {
      const end =
        statusPlan?.current_period_end ||
        transactionData?.currentPlan?.next_billing_date;
      return !isNullUndefinedOrBlank(end)
        ? formatedDate(end, "DD MMM, YYYY")
        : "";
    })(),
  };

  const handleDeleteClose = () => {
    setDeleteShow(false);
  };
  // const handleDeleteShow = () => {
  //     setDeleteShow(true);
  // }
  return (
    // subscription main dashboard
    <div className="subscription-main-container">
      {!showPlans && (
        <>
          <div className="subscription-box subscription-dash ">
            <Card>
              <Card.Body>
                <div className="setting-main-title">
                  <h2>Subscription</h2>
                </div>
                <div className="subscrip-dash-wrapper">
                  <div className="plan-container">
                    <div className="plan-item">
                      <p className="plan-label">Plan Tenure</p>
                      <p className="plan-value bold">{computed.planLabel}</p>
                    </div>
                    <div className="plan-item">
                      <p className="plan-label">Payment Amount</p>
                      <p className="plan-value bold">
                        ${computed.paymentAmount}
                      </p>
                    </div>

                    {/* {
                                                (transactionData?.currentPlan?.payment_method === "IAP") ?

                                                    <div className="plan-item">
                                                        <p className="plan-label">Next invoice issue date</p>
                                                        <p className="plan-value bold">{!isNullUndefinedOrBlank(transactionData?.currentPlan?.next_billing_date) ? convertUTCToLocal(transactionData?.currentPlan?.next_billing_date) : '-'}</p>
                                                    </div>
                                                    :
                                                    <div className="plan-item">
                                                        <p className="plan-label">Next invoice issue date</p>
                                                        <p className="plan-value bold">{!isNullUndefinedOrBlank(transactionData?.currentPlan?.next_billing_date) ? formatedDate(transactionData?.currentPlan?.next_billing_date, 'DD MMM, YYYY') : '-'}</p>
                                                    </div>
                                            } */}

                    <div className="plan-item">
                      <p className="plan-label">Next invoice issue date</p>
                      <p className="plan-value bold">
                        {computed.nextInvoiceDate}
                      </p>
                    </div>
                    <div className="plan-item">
                      <p className="plan-label">Total Billing</p>
                      <p className="plan-value bold">
                        $
                        {!isNullUndefinedOrBlank(
                          transactionData?.currentPlan?.total_amount_paid
                        )
                          ? transactionData?.currentPlan?.total_amount_paid
                          : 0}
                      </p>
                    </div>
                    <div className="plan-item">
                      <p className="plan-label">Subscription Status</p>
                      <p className="plan-value bold">
                        {computed.subscriptionStatus}
                      </p>
                    </div>

                    {!isNullUndefinedOrBlank(
                      transactionData?.currentPlan?.pending_plan_type
                    ) && (
                      <div className="plan-item">
                        <p className="plan-label">Upcoming Plan</p>
                        <p className="plan-value bold">
                          {!isNullUndefinedOrBlank(
                            transactionData?.currentPlan?.pending_plan_type
                          )
                            ? transactionData?.currentPlan?.pending_plan_type
                            : "-"}
                        </p>
                      </div>
                    )}

                    {!isNullUndefinedOrBlank(
                      transactionData?.currentPlan?.pending_plan_price
                    ) &&
                      transactionData?.currentPlan?.pending_plan_price > 0 && (
                        <div className="plan-item">
                          <p className="plan-label">Upcoming Plan Price</p>
                          <p className="plan-value bold">
                            {!isNullUndefinedOrBlank(
                              transactionData?.currentPlan?.pending_plan_price
                            )
                              ? transactionData?.currentPlan?.pending_plan_price
                              : "-"}
                          </p>
                        </div>
                      )}
                  </div>
                  {computed.managedByParent === true && (
                    <p className="mt-3 text-muted" style={{ marginBottom: 0 }}>
                      Your subscription is managed by a parent. Billing and plan
                      changes are handled by them.
                    </p>
                  )}
                </div>
                <div className="button-group">
                  {transactionData?.currentPlan?.payment_method === "Stripe" &&
                  transactionData?.currentPlan?.is_canceled === false &&
                  computed.managedByParent !== true ? (
                    <>
                      <Button
                        variant="primary"
                        className="btn-icon-text"
                        onClick={() => {
                          setPlansMode("update");
                          setShowPlans(true);
                        }}
                      >
                        <i className="material-symbols-outlined">refresh</i>{" "}
                        Change Plan
                      </Button>
                      <Button
                        variant="secondary"
                        className="btn-icon-text btn-manage-billing"
                        onClick={async () => {
                          try {
                            const base = window.location.origin + "/#";
                            const data: any = await (dispatch as any)(
                              studentBillingPortalAPI(base + "settings")
                            );
                            const url = data?.url;
                            if (url) {
                              window.location.assign(url);
                            }
                          } catch (e) {
                            // noop; Toaster already in interceptor if needed
                          }
                        }}
                      >
                        <i className="material-symbols-outlined">
                          account_balance_wallet
                        </i>{" "}
                        Manage billing
                      </Button>
                    </>
                  ) : computed.managedByParent === true ? (
                    <>
                      <Button
                        variant="primary"
                        className="btn-icon-text"
                        onClick={() => {
                          setPlansMode("upgrade");
                          setShowPlans(true);
                        }}
                      >
                        <i className="material-symbols-outlined">upgrade</i>{" "}
                        Upgrade with your own plan
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="subscription-box subscription-billing ">
            <Card>
              <Card.Body>
                <div className="setting-main-title">
                  <h2>Billing Details</h2>
                </div>
                <div className="table-responsive">
                  <Table className="table-theme">
                    <thead className="border-less">
                      <tr>
                        <th>Plan Description</th>
                        {/* <th>Month</th> */}
                        <th>Payment Date</th>
                        {/* <th>Payment Method</th> */}
                        <th>Status</th>
                        <th className="text-center">Plan Price</th>
                        {transactionData?.currentPlan?.payment_method ===
                          "Stripe" && <th className="text-center">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmptyObjectOrNullUndefiend(
                        transactionData?.transactions
                      ) ? (
                        transactionData?.transactions?.map((key, index) => {
                          return (
                            <tr>
                              <td>
                                {!isNullUndefinedOrBlank(key.plan_type)
                                  ? key.plan_type
                                  : ""}
                              </td>
                              {/* <td>Jun 2024</td> */}
                              {transactionData?.currentPlan?.payment_method ===
                              "Stripe" ? (
                                <td>
                                  {!isNullUndefinedOrBlank(key?.processed_at)
                                    ? formatedDate(
                                        key?.processed_at,
                                        "MM/DD/YYYY [At] hh:mm"
                                      )
                                    : "-"}
                                </td>
                              ) : (
                                <td>
                                  {!isNullUndefinedOrBlank(
                                    key?.iap_processed_at
                                  )
                                    ? formatedDate(
                                        key?.iap_processed_at,
                                        "MM/DD/YYYY [At] hh:mm"
                                      )
                                    : "-"}
                                </td>
                              )}
                              {/* <td>{!isNullUndefinedOrBlank(key?.payment_method) ? key?.payment_method : ""}</td> */}
                              <td>
                                <div
                                  className={
                                    key?.transaction_status === "paid" ||
                                    key?.transaction_status === "completed"
                                      ? "badge badge-success"
                                      : "badge badge-danger"
                                  }
                                >
                                  {!isNullUndefinedOrBlank(
                                    key?.transaction_status
                                  )
                                    ? key?.transaction_status
                                    : ""}
                                </div>
                              </td>
                              <td className="text-center">
                                <span className="link-info tbl-price text-decoration-underline text-link cursor-pointer">
                                  $
                                  {!isNullUndefinedOrBlank(key?.amount_paid)
                                    ? key?.amount_paid
                                    : 0}
                                </span>
                              </td>
                              {key?.invoice_pdf && (
                                <td className="tbl-action">
                                  <button
                                    className="btn btn-xs btn-icon-text btn-transparent text-danger"
                                    onClick={() => {
                                      window.open(key?.invoice_pdf, "_blank");
                                    }}
                                  >
                                    <i className="material-symbols-outlined">
                                      visibility
                                    </i>
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={6}>
                            No Transaction Found
                          </td>
                        </tr>
                      )}

                      {/* <tr>
                                        <td>6 month plan</td>
                                        <td>Jun 2024</td>
                                        <td>06/27/2024</td>
                                        <td>Credit Card</td>
                                        <td>Paid</td>
                                        <td>
                                            <span className="link-info tbl-price text-decoration-underline text-link cursor-pointer">$99.00</span>
                                        </td>
                                        <td className="tbl-action">
                                            <button className="btn btn-xs btn-icon-text btn-transparent text-danger">
                                                <i className="material-symbols-outlined">visibility</i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>6 month plan</td>
                                        <td>Jun 2024</td>
                                        <td>06/27/2024</td>
                                        <td>Credit Card</td>
                                        <td>Paid</td>
                                        <td>
                                            <span className="link-info tbl-price text-decoration-underline text-link cursor-pointer">$99.00</span>
                                        </td>
                                        <td className="tbl-action">
                                            <button className="btn btn-xs btn-icon-text btn-transparent text-danger">
                                                <i className="material-symbols-outlined">visibility</i>
                                            </button>
                                        </td>
                                    </tr> */}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
      {showPlans && (
        <div className="subscription-box subscription-plans">
          <Card>
            <Card.Body>
              <div className="setting-main-title align-items-center d-flex gap-3 setting-main-title">
                <Button
                  variant="white"
                  className="btn-icon btn-light-white btn-icon-text btn-md"
                  onClick={() => {
                    setShowPlans(false);
                  }}
                >
                  <i className="material-symbols-outlined fs-4">
                    arrow_left_alt
                  </i>
                </Button>
                <h2 className="mb-0">Choose Your Plan</h2>
              </div>
              <PricePlans
                updatePlan={plansMode === "update"}
                upgradeNoTrial={plansMode === "upgrade"}
                currentProductId={
                  transactionData?.currentPlan?.current_product_id
                }
                showPlans={showPlans}
                setShowPlans={setShowPlans}
                getTransactionList={getTransactionList}
              />
            </Card.Body>
          </Card>
        </div>
      )}
      <div className="subscription-payment-box d-none">
        <div className="payment-wrapper-container">
          <div className="payment-message-box succesfull-payment">
            <div className="payment-icon">
              <Button
                variant="primary"
                className="btn-icon btn-light-primary btn-icon-text btn-lg"
                style={{ pointerEvents: "none" }}
              >
                {" "}
                <i className="material-symbols-outlined fs-4">check_circle</i>
              </Button>
            </div>
            <div className="payment-title">
              <h2>Payment Successful! 🎉</h2>
              <p>
                Your subscription is now active. Thank you for joining Open
                Planner!
              </p>
            </div>
          </div>
          <div className="payment-message-box failed-payment d-none">
            <div className="payment-icon">
              <Button
                variant="danger"
                className="btn-icon btn-light-danger btn-icon-text btn-lg"
                style={{ pointerEvents: "none" }}
              >
                {" "}
                <i className="material-symbols-outlined fs-4">cancel</i>
              </Button>
            </div>
            <div className="payment-title">
              <h2>Payment Failed 😕</h2>
              <p>
                Something went wrong while processing your payment. Please try
                again.
              </p>
            </div>
            <div className="retry-btn">
              <Button variant="primary" className="btn-text">
                Retry Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="modal-theme modal-confirmation modal-reject"
        show={deleteShow}
        onHide={handleDeleteClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">Cancel Subscription</h4>
          <button
            type="button"
            className="btn-close"
            onClick={handleDeleteClose}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-confirmation-container">
            <div className="modal-confirmation-icon">
              <i className="material-symbols-outlined">delete</i>
            </div>
            <div className="modal-confirmation-content">
              <h5> Are You Sure?</h5>
              <p>
                If you cancel now, your subscription will remain active until
                {computed.currentPeriodEnd
                  ? ` ${computed.currentPeriodEnd}`
                  : " the end of your current billing period"}
                . You’ll keep access until then and won’t be charged again.
              </p>
            </div>
          </div>
          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            {
              // !deleteSuccess &&
              <Button
                variant="light-white"
                className="btn-md"
                onClick={handleDeleteClose}
              >
                Cancel
              </Button>
            }
            <Button
              variant={"danger"}
              className="btn-icon-text btn-md"
              onClick={() => {
                handleCancelSubscription();
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
