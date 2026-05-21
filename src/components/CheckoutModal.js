"use client";

import React, { useState } from "react";
import styles from "./CheckoutModal.module.css";

export default function CheckoutModal({ featureId, featureTitle, price, birthHash, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(""); // "", "processing", "success", "error"

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus("processing");

    try {
      // 1. Create order on the backend
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, price }),
      });
      const orderData = await res.json();

      if (orderData.error) {
        throw new Error(orderData.error);
      }

      // 2. Handle Fallback/Demo mode
      if (orderData.isDemo) {
        setTimeout(async () => {
          // Simulate backend verification for demo payment
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                featureId,
                birthHash,
                price,
                isDemo: true,
                razorpay_payment_id: "pay_demo_" + Math.random().toString(36).substring(2, 9),
                razorpay_order_id: orderData.orderId,
                razorpay_signature: "demo_signature"
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setPaymentStatus("success");
              setTimeout(() => {
                onSuccess(verifyData.token);
              }, 1200);
            } else {
              setPaymentStatus("error");
            }
          } catch (err) {
            setPaymentStatus("error");
          } finally {
            setLoading(false);
          }
        }, 2000); // 2 seconds transition
        return;
      }

      // 3. Handle real payment using Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please check your internet connection.");
        setPaymentStatus("");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AstroVeda",
        description: `Unlock ${featureTitle}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          setPaymentStatus("processing");
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                featureId,
                birthHash,
                price,
                isDemo: false
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setPaymentStatus("success");
              setTimeout(() => {
                onSuccess(verifyData.token);
              }, 1200);
            } else {
              setPaymentStatus("error");
            }
          } catch (err) {
            setPaymentStatus("error");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#dfb750"
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("");
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} cosmic-card`}>
        <button className={styles.closeBtn} onClick={onClose} disabled={loading}>×</button>
        
        {paymentStatus === "processing" && (
          <div className={styles.statusScreen}>
            <div className={styles.spinner}></div>
            <h3 className={styles.statusTitle}>Verifying Payment</h3>
            <p className={styles.statusDesc}>Securing transaction with payment gateway, please do not close this window...</p>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className={styles.statusScreen}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={`${styles.statusTitle} glow-gold`}>Payment Successful!</h3>
            <p className={styles.statusDesc}>Your premium report has been unlocked. Reading celestial charts...</p>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className={styles.statusScreen}>
            <div className={styles.errorIcon}>✕</div>
            <h3 className={styles.statusTitle}>Transaction Failed</h3>
            <p className={styles.statusDesc}>Something went wrong. Please check details or try again.</p>
            <button className="btn-gold" onClick={() => setPaymentStatus("")}>Try Again</button>
          </div>
        )}

        {paymentStatus === "" && (
          <>
            <div className={styles.header}>
              <span className={styles.sparkle}>✦</span>
              <h2 className={styles.title}>Unlock Premium Report</h2>
              <p className={styles.subtitle}>{featureTitle}</p>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span className={styles.check}>✦</span>
                <span>Complete in-depth predictions and timelines</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.check}>✦</span>
                <span>Personalized astrology remedies & gemstone guidance</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.check}>✦</span>
                <span>Printable PDF report format (ready to download)</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.check}>✦</span>
                <span>Lifetime 30-day access locked to your birth details</span>
              </div>
            </div>

            <div className={styles.paymentSection}>
              <div className={styles.priceContainer}>
                <span className={styles.priceLabel}>TOTAL AMOUNT</span>
                <span className={styles.priceValue}>₹{price}</span>
              </div>

              {/* UPI & Card visual branding */}
              <div className={styles.upiBadges}>
                <span className={styles.upiBadge}>Google Pay</span>
                <span className={styles.upiBadge}>PhonePe</span>
                <span className={styles.upiBadge}>Paytm</span>
                <span className={styles.upiBadge}>Cards / UPI QR</span>
              </div>

              <button className="btn-gold pulse-button styles.payBtn" onClick={handlePayment}>
                Pay ₹{price} & Unlock Report ✦
              </button>
              
              <p className={styles.disclaimer}>
                Secure 256-bit SSL encrypted connection. Returns verified by signature.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
