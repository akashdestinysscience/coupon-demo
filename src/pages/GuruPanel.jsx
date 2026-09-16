import { useState } from "react";
import { useData } from "../context/DataContext";
import CouponForm from "../components/CouponForm";
import { GURUS } from "../utils/mockData";

export default function GuruPanel() {
  const { coupons, usages, addCoupon } = useData();
  const [selectedGuruId, setSelectedGuruId] = useState(GURUS[0].id);

  const myCoupons = coupons.filter(
    (c) => c.sourceType === "guru" && c.guruId === selectedGuruId
  );

  function handleCreate(formData) {
    const coupon = {
      id: `coupon-${Date.now()}`,
      sourceType: "guru",
      guruId: selectedGuruId,
      ...formData,
    };
    addCoupon(coupon);
  }

  function couponStats(couponId) {
    const couponUsages = usages.filter((u) => u.couponId === couponId);
    const totalDiscount = couponUsages.reduce((sum, u) => sum + u.discountAmount, 0);
    return { count: couponUsages.length, totalDiscount };
  }

  return (
    <div className="page">
      <h1>Guru Panel — Create My Coupon</h1>

      <label className="guru-select">
        Logged in as:
        <select value={selectedGuruId} onChange={(e) => setSelectedGuruId(e.target.value)}>
          {GURUS.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </label>

      <CouponForm onSubmit={handleCreate} submitLabel="Create My Coupon" />

      <h2>My Coupons ({GURUS.find((g) => g.id === selectedGuruId)?.name})</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Applicable On</th>
            <th>Min Order</th>
            <th>Valid</th>
            <th>Max Uses</th>
            <th>Max/Customer</th>
            <th>Usage Count</th>
            <th>Total Discount Given</th>
          </tr>
        </thead>
        <tbody>
          {myCoupons.length === 0 && (
            <tr><td colSpan={9} className="empty">No coupons yet for this guru.</td></tr>
          )}
          {myCoupons.map((c) => {
            const { count, totalDiscount } = couponStats(c.id);
            return (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td>{c.applicableOn}</td>
                <td>₹{c.minOrderValue}</td>
                <td>{c.validFrom} → {c.validTo}</td>
                <td>{c.maxUses}</td>
                <td>{c.maxUsesPerCustomer}</td>
                <td>{count}</td>
                <td>₹{totalDiscount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
