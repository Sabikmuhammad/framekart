"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PremiumVisitorPopup from "./PremiumVisitorPopup";

export default function VisitorTracker() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // HARD RULE: Do not process anything on custom-frame
    if (pathname?.startsWith("/custom-frame")) {
      setShowPopup(false);
      setIsEligible(false);
      return;
    }

    // Check if user has already successfully submitted
    const isCaptured = localStorage.getItem("fk_visitor_captured") === "true";
    if (isCaptured) return;

    // Check dismiss history
    const dismissHistoryStr = localStorage.getItem("fk_visitor_dismiss_history");
    let dismissHistory: number[] = [];
    try {
      if (dismissHistoryStr) {
        dismissHistory = JSON.parse(dismissHistoryStr);
      }
    } catch (e) {
      // ignore
    }

    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // Clean up old dismissals (> 7 days)
    dismissHistory = dismissHistory.filter(ts => now - ts < SEVEN_DAYS);
    localStorage.setItem("fk_visitor_dismiss_history", JSON.stringify(dismissHistory));

    // Limit repeated popups: Max 3 times per 7 days
    if (dismissHistory.length >= 3) {
      return;
    }

    // Cooldown: 24 hours since last dismissal
    if (dismissHistory.length > 0) {
      const lastDismissal = dismissHistory[dismissHistory.length - 1];
      if (now - lastDismissal < TWENTY_FOUR_HOURS) {
        return;
      }
    }

    // Initialize or get first visit
    let firstVisit = localStorage.getItem("fk_visitor_first_visit");
    if (!firstVisit) {
      firstVisit = now.toString();
      localStorage.setItem("fk_visitor_first_visit", firstVisit);
    }

    // Update engagement metrics based on route
    const isProductPage = pathname?.startsWith("/products/") || pathname?.startsWith("/frames/");
    const isCartAction = pathname === "/cart";

    let productViews = parseInt(localStorage.getItem("fk_visitor_product_views") || "0", 10);
    if (isProductPage) {
      productViews += 1;
      localStorage.setItem("fk_visitor_product_views", productViews.toString());
    }

    if (isCartAction) {
      localStorage.setItem("fk_visitor_cart_active", "true");
    }

    const cartActive = localStorage.getItem("fk_visitor_cart_active") === "true";
    const timeOnSiteSeconds = (now - parseInt(firstVisit, 10)) / 1000;

    // Check if meaningful engagement has occurred
    let shouldShow = false;

    if (timeOnSiteSeconds > 20) {
      shouldShow = true;
    } else if (productViews >= 2) {
      shouldShow = true;
    } else if (cartActive) {
      shouldShow = true;
    }

    if (shouldShow) {
      setIsEligible(true);
      // Small delay so it feels natural, not instant on page load
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    setShowPopup(false);
    
    // Add to dismiss history
    const dismissHistoryStr = localStorage.getItem("fk_visitor_dismiss_history");
    let dismissHistory: number[] = [];
    if (dismissHistoryStr) {
      try {
        dismissHistory = JSON.parse(dismissHistoryStr);
      } catch (e) {}
    }
    
    dismissHistory.push(Date.now());
    localStorage.setItem("fk_visitor_dismiss_history", JSON.stringify(dismissHistory));
  };

  const handleSuccess = () => {
    setShowPopup(false);
    localStorage.setItem("fk_visitor_captured", "true");
  };

  // HARD RULE: The global visitor tracker must NEVER render or operate on custom-frame.
  if (pathname?.startsWith("/custom-frame")) {
    return null;
  }

  if (!isEligible) return null;

  return (
    <PremiumVisitorPopup 
      isOpen={showPopup} 
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
}
