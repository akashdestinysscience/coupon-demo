import { useState } from "react";
import { useData } from "../context/DataContext";
import { validateCoupon } from "../utils/couponValidation";
import { CUSTOMERS, MOCK_PRICES, PURCHASE_TYPES } from "../utils/mockData";

export default function Checkout() {
  const { coupons, usages, addUsage } = useData();

  const [customerId, setCustomerId] = useState(CUSTOMERS[0].id);
  const [purchaseType, setPurchaseType] = useState(PURCHASE_TYPES.CONSULTATION);
  const [codeInput, setCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { coupon, discountAmount, finalAmount }
  const [error, setError] = useState("");
  const [confirmedMessage, setConfirmedMessage] = useState("");

  const orderValue = MOCK_PRICES[purchaseType];

  function resetCouponState() {
    setAppliedCoupon(null);
    setError("");
    setConfirmedMessage("");
  }

  function handlePurchaseTypeChange(value) {
    setPurchaseType(value);
    resetCouponState();
    setCodeInput("");
  }

  function handleCustomerChange(value) {
    setCustomerId(value);
    resetCouponState();
    setCodeInput("");
  }

  function handleApplyCoupon() {
    setError("");
    setConfirmedMessage("");

    const code = codeInput.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === code);

    const result = validateCoupon({
      coupon,
      customerId,
      purchaseType,
      orderValue,
      usageHistory: usages,
      alreadyAppliedCoupon: appliedCoupon?.coupon ?? null,
    });

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setAppliedCoupon({
      coupon,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    });
  }

  function handleRemoveCoupon() {
    resetCouponState();
  }

  function handleConfirm() {
    if (appliedCoupon) {
      const { coupon, discountAmount } = appliedCoupon;
      addUsage({
        id: `usage-${Date.now()}`,
        couponId: coupon.id,
        code: coupon.code,
        sourceType: coupon.sourceType,
        // Source-specific tagging happens only here, at the logging step.
        campaignId: coupon.sourceType === "company" ? coupon.campaignId : null,
        guruId: coupon.sourceType === "guru" ? coupon.guruId : null,
        customerId,
        purchaseType,
        orderValue,
        discountAmount,
        finalAmount: appliedCoupon.finalAmount,
        date: new Date().toISOString(),
      });
    }

    const customerName = CUSTOMERS.find((c) => c.id === customerId)?.name;
    setConfirmedMessage(
      appliedCoupon
        ? `Confirmed! ${customerName} paid ₹${appliedCoupon.finalAmount.toFixed(2)} (₹${appliedCoupon.discountAmount.toFixed(2)} discount applied).`
        : `Confirmed! ${customerName} paid ₹${orderValue}.`
    );
    setAppliedCoupon(null);
    setCodeInput("");
  }

  const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : orderValue;

  return (
    <div className="page">
      <h1>Customer Checkout (Mock)</h1>

      <div className="form-row two-col">
        <label>
          Customer
          <select value={customerId} onChange={(e) => handleCustomerChange(e.target.value)}>
            {CUSTOMERS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Purchase Type
          <select value={purchaseType} onChange={(e) => handlePurchaseTypeChange(e.target.value)}>
            <option value={PURCHASE_TYPES.CONSULTATION}>Booking a consultation (₹{MOCK_PRICES.consultation})</option>
            <option value={PURCHASE_TYPES.PRODUCT}>Buying a product (₹{MOCK_PRICES.product})</option>
          </select>
        </label>
      </div>

      <div className="cart-summary">
        <p>Order value: <strong>₹{orderValue}</strong></p>
      </div>

      {!appliedCoupon && (
        <div className="form-row coupon-input-row">
          <label>
            Have a coupon code?
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="e.g. SITEWIDE25"
            />
          </label>
          <button className="btn-secondary" onClick={handleApplyCoupon} disabled={!codeInput.trim()}>
            Apply Coupon
          </button>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      {appliedCoupon && (
        <div className="applied-coupon-box">
          <p>
            Coupon <strong>{appliedCoupon.coupon.code}</strong> applied — discount ₹{appliedCoupon.discountAmount.toFixed(2)}
          </p>
          <button className="btn-link" onClick={handleRemoveCoupon}>Remove coupon</button>
        </div>
      )}

      <div className="final-amount">
        <p>Final payable amount: <strong>₹{finalAmount.toFixed(2)}</strong></p>
      </div>

      <button className="btn-primary" onClick={handleConfirm}>
        {purchaseType === PURCHASE_TYPES.CONSULTATION ? "Confirm Booking" : "Confirm Order"}
      </button>

      {confirmedMessage && <p className="success-msg">{confirmedMessage}</p>}
    </div>
  );
}
