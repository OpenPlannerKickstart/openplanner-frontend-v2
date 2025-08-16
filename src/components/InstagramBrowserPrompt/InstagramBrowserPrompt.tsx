/// <reference types="react" />
import React, { useEffect, useState } from "react";
import "./InstagramBrowserPrompt.css";
import firefoxsvg from "./firefox.svg";
import chromesvg from "./chrome.svg";
import operasvg from "./opera.svg";
import edgesvg from "./edge.svg";
import safarisvg from "./safari.svg";

interface InstagramBrowserPromptProps {
  onClose?: () => void;
  customMessage?: string;
}

/**
 * Component that detects if user is on Instagram and prompts them to open in browser
 * @param {InstagramBrowserPromptProps} props - Component props
 * @returns {JSX.Element | null} JSX element or null if not on Instagram
 */
const InstagramBrowserPrompt: React.FC<InstagramBrowserPromptProps> = ({
  onClose,
  customMessage,
}) => {
  const [isInstagram, setIsInstagram] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is accessing from Instagram in-app browser
    const checkInstagramBrowser = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;

      // Instagram in-app browser detection
      const isInstagramApp =
        /Instagram/i.test(userAgent) ||
        /FBAN|FBAV/i.test(userAgent) || // Facebook/Instagram app
        window.location.href.includes("instagram.com");

      if (isInstagramApp) {
        setIsInstagram(true);
        setShowPrompt(true);
      }
    };

    checkInstagramBrowser();
  }, []);

  const handleCopyToClipboard = () => {
    const currentUrl = window.location.href;
    copyToClipboard(currentUrl);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("URL copied to clipboard! Please paste it in your browser.");
        })
        .catch(() => {
          // If clipboard API fails, show the URL for manual copying
          alert(`Please copy this URL and paste it in your browser: ${text}`);
        });
    } else {
      // For non-secure contexts or unsupported browsers, show the URL
      alert(`Please copy this URL and paste it in your browser: ${text}`);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isInstagram || !showPrompt) {
    return null;
  }

  return (
    <div className="instagram-prompt-overlay">
      <div className="instagram-prompt-modal">
        <div className="instagram-prompt-header">
          <h3>Browser Recommended</h3>
          <button onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="instagram-prompt-content">
          <div className="strip" aria-label="Browser logos">
            <img src={firefoxsvg} alt="Mozilla Firefox" loading="lazy" />
            <img src={chromesvg} alt="Google Chrome" loading="lazy" />
            <img src={operasvg} alt="Opera" loading="lazy" />
            <img src={edgesvg} alt="Microsoft Edge" loading="lazy" />
            <img src={safarisvg} alt="Apple Safari" loading="lazy" />
          </div>
          <p>
            {customMessage ||
              "For the best experience, open this app in your browser. Tap ⋯ (top right) → 'Open in Browser', or copy the URL below and paste it in your browser."}
          </p>

          <div className="instagram-prompt-buttons">
            <button
              onClick={handleCopyToClipboard}
              className="instagram-prompt-primary"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={handleClose}
              className="instagram-prompt-secondary"
            >
              Continue Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramBrowserPrompt;
