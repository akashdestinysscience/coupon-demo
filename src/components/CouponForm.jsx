import { useState } from "react";
import { APPLICABLE_ON_OPTIONS, DISCOUNT_TYPES } from "../utils/mockData";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  applicableOn: "both",
  minOrderValue: "",
  validFrom: "",
  validTo: "",
  maxUses: "",
  maxUsesPerCustomer: "",
};

// Shared form used by both the Admin panel (company coupons) and the
// Guru panel (guru coupons). The caller decides what extra fields to
// tag onto the coupon object (campaignId vs guruId) via onSubmit.
export default function CouponForm({ onSubmit, submitLabel = "Create Coupon" }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.code.trim()) {
      alert("Please enter a coupon code.");
      return;
    }
    onSubmit({
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      applicableOn: form.applicableOn,
      minOrderValue: Number(form.minOrderValue) || 0,
      validFrom: form.validFrom,
      validTo: form.validTo,
      maxUses: Number(form.maxUses),
      maxUsesPerCustomer: Number(form.maxUsesPerCustomer),
    });
    setForm(initialForm);
  }

  return (
    <form className="coupon-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Coupon Code
          <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. SITEWIDE25" required />
        </label>
      </div>

      <div className="form-row two-col">
        <label>
          Discount Type
          <select name="discountType" value={form.discountType} onChange={handleChange}>
            {DISCOUNT_TYPES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </label>
        <label>
          Discount Value
          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Applicable On
          <select name="applicableOn" value={form.applicableOn} onChange={handleChange}>
            {APPLICABLE_ON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Min Order Value (₹)
          <input
            type="number"
            name="minOrderValue"
            value={form.minOrderValue}
            onChange={handleChange}
            min="0"
          />
        </label>
      </div>

      <div className="form-row two-col">
        <label>
          Valid From
          <input type="date" name="validFrom" value={form.validFrom} onChange={handleChange} required />
        </label>
        <label>
          Valid To
          <input type="date" name="validTo" value={form.validTo} onChange={handleChange} required />
        </label>
      </div>

      <div className="form-row two-col">
        <label>
          Max Total Uses
          <input
            type="number"
            name="maxUses"
            value={form.maxUses}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <label>
          Max Uses Per Customer
          <input
            type="number"
            name="maxUsesPerCustomer"
            value={form.maxUsesPerCustomer}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>

      <button type="submit" className="btn-primary">{submitLabel}</button>
    </form>
  );
}
