import React from "react";
import LegalLayout from "./LegalLayout";
import "../FAQs/FAQPage.css";

const TermsPage = () => (
  <LegalLayout title="Terms and Conditions" updated="Effective Date: July 30, 2025">
    <div className="legal-section">
      <p>Welcome to Open Planner. These Terms and Conditions govern your use of our platform and services. By using Open Planner, you agree to these terms.</p>
    </div>

    <div className="legal-section">
      <h2>1. Account Registration</h2>
      <p>You must provide accurate information when creating an account and keep your credentials secure. You are responsible for all activity under your account.</p>
    </div>

    <div className="legal-section">
      <h2>2. Acceptable Use</h2>
      <ul>
        <li>Do not use the Service for unlawful purposes.</li>
        <li>Do not attempt to access or disrupt other accounts or systems.</li>
        <li>Do not upload malicious code or infringing content.</li>
      </ul>
    </div>

    <div className="legal-section">
      <h2>3. Subscriptions and Payments</h2>
      <ul>
        <li>Subscription fees, billing cycles, and renewal terms are presented during checkout.</li>
        <li>Payments are processed through secure third-party providers.</li>
        <li>Refunds, if applicable, follow our posted refund policy.</li>
      </ul>
    </div>

    <div className="legal-section">
      <h2>4. Intellectual Property</h2>
      <p>Open Planner owns all platform content and IP except for materials you upload. You retain rights to your content while granting us a license to operate the Service.</p>
    </div>

    <div className="legal-section">
      <h2>5. Termination</h2>
      <p>We may suspend or terminate access for violations of these terms or unlawful activity. You may cancel your subscription at any time.</p>
    </div>

    <div className="legal-section">
      <h2>6. Disclaimers</h2>
      <p>Open Planner is provided "as is" without warranties of any kind. We do not guarantee complete accuracy of extracted dates or uninterrupted service.</p>
    </div>

    <div className="legal-section">
      <h2>7. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, our liability is limited to the amount you paid for the service during the preceding 12 months.</p>
    </div>

    <div className="legal-section">
      <h2>8. Changes to Terms</h2>
      <p>We may update these terms; continued use after changes constitutes acceptance. Significant updates may be communicated via email or in-product notice.</p>
    </div>

    <div className="legal-section">
      <h2>9. Contact</h2>
      <p>Questions? Contact us at <a href="mailto:admin@open-planner.com">admin@open-planner.com</a>.</p>
    </div>
  </LegalLayout>
);

export default TermsPage;
