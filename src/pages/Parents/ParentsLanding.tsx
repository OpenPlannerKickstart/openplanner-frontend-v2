import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { getAllPlanAPI, parentsCreateSessionAPI } from '../../redux/Service/User/Settings/settings'
import { te } from '../../Utility/Toaster'
import authLogo from '/assets/images/auth-logo.svg'

type Plan = {
  product_id: string
  title: string
  price: number
  duration: string
  features: string[]
}

// no defaultPlans in testing; we rely on BE response exclusively

const ParentsLanding = () => {
  const dispatch: AppDispatch = useDispatch();
  const [plans, setPlans] = useState<Plan[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [parentEmail, setParentEmail] = useState<string>('')
  const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)
  // Student emails are collected on success page only

  useEffect(() => {
    let meta: HTMLMetaElement | null = document.querySelector('meta[name="robots"]');
    const previous = meta?.getAttribute('content') || '';
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex,nofollow');
    return () => {
      if (meta) {
        if (previous) meta.setAttribute('content', previous);
        else document.head.removeChild(meta);
      }
    }
  }, [])

  useEffect(() => {
    const fetchPlans = async () => {
      const response: any = await dispatch(getAllPlanAPI({ payment_method: 'Stripe' }));
      if (response?.payload) {
        const list = (response.payload as Plan[]).slice().sort((a: any, b: any) => Number(a.price) - Number(b.price));
        // Use ONLY backend plans to avoid sending unknown IDs to BE during testing
        setPlans(list);
      }
    }
    fetchPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalItems = useMemo(() => Object.values(cart).reduce((s, q) => s + q, 0), [cart])
  const totalAmount = useMemo(() => {
    return Object.entries(cart).reduce((sum, [productId, qty]) => {
      const plan = plans.find(p => p.product_id === productId)
      return plan ? sum + plan.price * qty : sum
    }, 0)
  }, [cart, plans])

  const increment = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
  }
  const decrement = (productId: string) => {
    setCart(prev => {
      const next = { ...prev }
      const current = next[productId] || 0
      if (current <= 1) delete next[productId]
      else next[productId] = current - 1
      return next
    })
  }

  // No student email collection here

  const handleProceed = () => {
    const items = Object.entries(cart)
      .map(([key, quantity]) => {
        const p: any = plans.find(pl => pl.product_id === key)
        const product_id = p?.product_id || key
        // Option (b): send only product_id; BE resolves price internally
        return { product_id, quantity }
      })
      .filter((i) => i.quantity > 0)
    if (items.length === 0) return
    if (!isValidEmail(parentEmail)) {
      te('Please enter a valid parent email')
      return
    }
    const body: any = { items }
    body.parent_email = parentEmail.trim()
    dispatch(parentsCreateSessionAPI(body))
      .then((data: any) => {
        if (data?.url) {
          window.location.href = data.url
        } else {
          te('Unable to start checkout. Please try again.')
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Checkout session failed.'
        te(msg)
      })
  }

  return (
    <div className='payment-plans-container parents-plans'>
      <div className="admin-auth-wrapper admin-auth-side-image">
        <div className="admin-auth-inner-wrapper">
          <div className="admin-auth-row">
            <div className="admin-auth-col admin-auth-left">
              <div className="admin-auth-logo d-flex align-items-center justify-content-between">
                <img src={authLogo} alt="OpenPlanner" />
                <div></div>
              </div>

              <div className="subscription-box subscription-plans auth-plans" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className="plans-header">
                  <h2>Choose Your Plan</h2>
                  <p>Start with a 7-day free trial. Upgrade anytime for full access to all features.</p>
                </div>

                <Row className="g-3 g-lg-4 row-cols-1 row-cols-md-3 justify-content-between">
                  {plans.map((plan) => (
                    <Col key={plan.product_id}>
                      <Card className="pricing-card">
                        <Card.Header>
                          <span className="trial-label">{plan.title}</span>
                          <span className="popular-tag">Popular</span>
                        </Card.Header>
                        <Card.Body>
                          <div className="price-section d-flex align-items-baseline flex-wrap gap-2">
                            <span className="price">${Number(plan.price).toFixed(2)}</span>
                            <span className="duration d-block d-lg-inline-block mt-1 mt-lg-0 ms-0 ms-lg-1" style={{ lineHeight: 1.2 }}>{plan.duration}</span>
                          </div>
                          <div className="divider"></div>
                          <div className="features-section">
                            <h4>FEATURES</h4>
                              <ul>
                                {plan.features.map((f, i) => {
                                  const normalized = (typeof f === 'string' && f.trim().toLowerCase() === 'full mobile application access') ? 'Full mobile application access' : f;
                                  return (
                                    <li key={i}><i className="material-symbols-outlined check-icon">check_circle</i> {normalized}</li>
                                  );
                                })}
                              </ul>
                          </div>
                          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                            <Button aria-label="Decrease" variant="outline-primary" className="btn-icon" onClick={() => decrement(plan.product_id)}>-</Button>
                            <span className="btn btn-primary btn-text px-4" style={{ pointerEvents: 'none', cursor: 'default' }}>
                              {(cart[plan.product_id] || 0)} {(cart[plan.product_id] || 0) === 1 ? 'student' : 'students'}
                            </span>
                            <Button aria-label="Increase" variant="outline-primary" className="btn-icon" onClick={() => increment(plan.product_id)}>+</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Summary section below cards (not in a Card) */}
                <div className="mt-2">
                  <p className="text-muted mb-1">Select quantities above. Codes will be shown on the next screen and can be emailed to students.</p>
                  <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
                    <Form.Control style={{ maxWidth: 360 }} type="email" placeholder="Parent email (required)" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
                    <div className="ms-md-auto d-flex align-items-center gap-2">
                      <strong>Total:</strong>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <Button variant="primary" disabled={totalItems === 0 || !isValidEmail(parentEmail)} onClick={handleProceed}>Proceed to checkout</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentsLanding


