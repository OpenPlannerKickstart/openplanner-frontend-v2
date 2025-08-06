import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';


const plans = [
  {
    title: "7 Day Free Trial",
    price: "$14.99",
    duration: "for 6 months",
    features: [
      "Unlimited syllabus uploads",
      "Full website access",
      "Full mobile application access",
      "Notifications",
    ],
  },
  {
    title: "7 Day Free Trial",
    price: "$23.99",
    duration: "for 1 year",
    features: [
      "Unlimited syllabus uploads",
      "Full website access",
      "Full mobile application access",
      "Notifications",
    ],
  },
  {
    title: "7 Day Free Trial",
    price: "$35.99",
    duration: "for 2 years",
    features: [
      "Unlimited syllabus uploads",
      "Full website access",
      "Full mobile application access",
      "Notifications",
    ],
  },
];



export const PricePlans = () => {
  return (
    <div className="pricing-wrapper">
        <Row>
            {plans.map((plan, index) => (
          <Col xs={12} md={4} key={index}>
            <Card className="pricing-card">
              <Card.Header>
                <span className="trial-label">{plan.title}</span>
                <span className="popular-tag">Popular</span>
                    </Card.Header>
                    <Card.Body>
                        <div className="price-section">
                        <span className="price">{plan.price}</span>
                        <span className="duration">{plan.duration}</span>
                        </div>
                        <button className="btn-started">Get started</button>
                        <div className="divider"></div>
                        <div className="features-section">
                        <h4>FEATURES</h4>
                        <ul>
                            {plan.features.map((feature, i) => (
                            <li key={i}>
                                <span className="check-icon">✔</span> {feature}
                            </li>
                            ))}
                        </ul>
                        </div>
                    </Card.Body>
                </Card>   
            </Col>
        ))}
      </Row>             
    </div>
  )
}
