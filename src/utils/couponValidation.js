// Core coupon validation logic.
//
// This ONE function is shared by every coupon source (company or guru).
// Source-specific behavior (campaignId vs guruId) is only applied later,
// at the point where a CouponUsage record is logged — never here.

/**
 * @param {object} params
 * @param {object} params.coupon - The Coupon object to validate (or undefined if not found).
 * @param {string} params.customerId - The customer attempting to use the coupon.
 * @param {string} params.purchaseType - "consultation" | "product".
 * @param {number} params.orderValue - The order amount before discount.
 * @param {object[]} params.usageHistory - All existing CouponUsage records.
 * @param {object|null} params.alreadyAppliedCoupon - Coupon already applied to this order, if any.
 * @returns {{ valid: boolean, error?: string, discountAmount?: number, finalAmount?: number }}
 */
export function validateCoupon({
  coupon,
  customerId,
  purchaseType,
  orderValue,
  usageHistory,
  alreadyAppliedCoupon,
}) {
  // g) Only one coupon allowed per order — block stacking.
  if (alreadyAppliedCoupon) {
    return {
      valid: false,
      error: `A coupon (${alreadyAppliedCoupon.code}) is already applied to this order. Remove it before applying another.`,
    };
  }

  // a) Code exists?
  if (!coupon) {
    return { valid: false, error: "This coupon code doesn't exist." };
  }

  // b) Is it currently active (within validFrom/validTo)?
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validTo = new Date(coupon.validTo);
  if (now < validFrom) {
    return { valid: false, error: "This code isn't active yet." };
  }
  if (now > validTo) {
    return { valid: false, error: "This code has expired." };
  }

  // c) Has maxUses (total) been reached?
  const totalUses = usageHistory.filter((u) => u.couponId === coupon.id).length;
  if (totalUses >= coupon.maxUses) {
    return { valid: false, error: "This code has reached its usage limit." };
  }

  // d) Has this specific customer already used it (maxUsesPerCustomer)?
  const customerUses = usageHistory.filter(
    (u) => u.couponId === coupon.id && u.customerId === customerId
  ).length;
  if (customerUses >= coupon.maxUsesPerCustomer) {
    return { valid: false, error: "You've already used this code the maximum number of times." };
  }

  // e) Does applicableOn match the current purchase type?
  if (coupon.applicableOn !== "both" && coupon.applicableOn !== purchaseType) {
    const label = coupon.applicableOn === "consultation" ? "consultations" : "products";
    return { valid: false, error: `This code doesn't apply to ${purchaseType === "product" ? "products" : "consultations"}. It's only valid for ${label}.` };
  }

  // f) Does the order value meet minOrderValue?
  if (orderValue < coupon.minOrderValue) {
    return {
      valid: false,
      error: `Order value must be at least ₹${coupon.minOrderValue} to use this code.`,
    };
  }

  // All checks passed — compute discount.
  let discountAmount =
    coupon.discountType === "percentage"
      ? (orderValue * coupon.discountValue) / 100
      : coupon.discountValue;

  // Discount can never exceed the order value.
  discountAmount = Math.min(discountAmount, orderValue);
  const finalAmount = orderValue - discountAmount;

  return { valid: true, discountAmount, finalAmount };
}
