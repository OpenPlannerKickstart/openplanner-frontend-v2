import React from "react";
import LegalLayout from "./LegalLayout";
import "../FAQs/FAQPage.css";

const PrivacyPolicyPage = () => (
  <LegalLayout title="Privacy Policy" updated="Effective Date: July 30, 2025">
    <div className="legal-section">
      <p>
        Open Planner ("Company", "we", "us", or "our") respects your privacy and is committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
      </p>
    </div>

    <div className="legal-section">
      <h2>1. Definitions</h2>
      <p><strong>Personal Information</strong> means any information that identifies, relates to, or could reasonably be linked with an individual.</p>
      <p><strong>Services</strong> refers to our platform, tools, features, and associated content provided via open-planner.com.</p>
      <p><strong>Institution</strong> refers to a university or academic organization providing access through a license agreement.</p>
    </div>

    <div className="legal-section">
      <h2>2. Information We Collect</h2>
      <h3>Information You Provide to Us:</h3>
      <ul>
        <li>Email address, username, password (hashed), phone (optional)</li>
        <li>Payment info (processed via PCI-compliant third parties)</li>
        <li>Uploaded documents, such as class syllabi or notes</li>
      </ul>
      <h3>Information Collected Automatically:</h3>
      <ul>
        <li>Device and browser details, IP address</li>
        <li>Date/time of access and usage logs</li>
      </ul>
    </div>

    <div className="legal-section">
      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>Create and manage your account</li>
        <li>Provide, personalize, and improve services</li>
        <li>Communicate about updates or support</li>
        <li>Process payments and prevent fraud</li>
        <li>Conduct analytics and develop new features</li>
        <li>Comply with legal requirements</li>
      </ul>
    </div>

    <div className="legal-section">
      <h2>4. Legal Basis for Processing</h2>
      <p>For applicable regions (e.g., EEA), legal bases include consent, contractual necessity, legal obligations, and legitimate interests.</p>
    </div>

    <div className="legal-section">
      <h2>5. Sharing Your Information</h2>
      <ul>
        <li><strong>Service Providers:</strong> payment processors, cloud, analytics (contractually required to protect data).</li>
        <li><strong>Institutional Partners:</strong> aggregated or user-specific data if using Open Planner via a university.</li>
        <li><strong>Legal Authorities:</strong> to comply with law, court order, or request.</li>
        <li><strong>Business Transfers:</strong> in a merger or acquisition, with continued protection of your data.</li>
      </ul>
    </div>

    <div className="legal-section">
      <h2>6. Data Security</h2>
      <p>We use administrative, technical, and physical safeguards. Passwords are hashed; payment data is handled by secure, PCI-compliant providers.</p>
    </div>

    <div className="legal-section">
      <h2>7. Data Retention</h2>
      <ul>
        <li>Personal data is stored while your account is active.</li>
        <li>Inactive accounts may be archived/deleted after 12 months.</li>
        <li>Aggregated/anonymized data may be retained for analytics.</li>
      </ul>
      <p>You may request deletion at any time (see Section 9).</p>
    </div>

    <div className="legal-section">
      <h2>8. Your Privacy Rights</h2>
      <ul>
        <li>Access, correct, or update your data</li>
        <li>Request deletion of your account/data</li>
        <li>Withdraw consent or object to processing</li>
        <li>Opt out of non-essential emails</li>
      </ul>
      <p>Contact <a href="mailto:admin@open-planner.com">admin@open-planner.com</a> to exercise your rights.</p>
    </div>

    <div className="legal-section">
      <h2>9. Children&apos;s Privacy</h2>
      <p>Services are not intended for users under 13. If we learn we have such data, we will delete it promptly.</p>
    </div>

    <div className="legal-section">
      <h2>10. Cookies and Tracking</h2>
      <p>We use cookies for authentication, UX, and analytics. You can manage cookies in your browser; some features may be limited if disabled.</p>
    </div>

    <div className="legal-section">
      <h2>11. Third-Party Links</h2>
      <p>Our site may link to third-party sites or tools (e.g., calendar integrations). We are not responsible for their practices.</p>
    </div>

    <div className="legal-section">
      <h2>12. Changes to This Policy</h2>
      <p>We may update this policy. Significant changes may be communicated via email or in-product notice.</p>
    </div>

    <div className="legal-section">
      <h2>13. Contact Us</h2>
      <p>
        Email: <a href="mailto:admin@open-planner.com">admin@open-planner.com</a><br />
        Address: 1104 Sabine St, Austin, Texas 78701
      </p>
    </div>
  </LegalLayout>
);

export default PrivacyPolicyPage;
