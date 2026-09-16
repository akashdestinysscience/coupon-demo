import { useData } from "../context/DataContext";
import CouponForm from "../components/CouponForm";

function generateCampaignId() {
  return `campaign-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function AdminPanel() {
  const { coupons, usages, addCoupon } = useData();

  const companyCoupons = coupons.filter((c) => c.sourceType === "company");

  function handleCreate(formData) {
    const coupon = {
      id: `coupon-${Date.now()}`,
      sourceType: "company",
      campaignId: generateCampaignId(),
      ...formData,
    };
    addCoupon(coupon);
  }

  function usageCount(couponId) {
    return usages.filter((u) => u.couponId === couponId).length;
  }

  return (
    <div className="page">
      <h1>Admin Panel — Create Company Coupon</h1>
      <CouponForm onSubmit={handleCreate} submitLabel="Create Company Coupon" />

      <h2>Company Coupons</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Campaign ID</th>
            <th>Discount</th>
            <th>Applicable On</th>
            <th>Min Order</th>
            <th>Valid</th>
            <th>Max Uses</th>
            <th>Max/Customer</th>
            <th>Usage Count</th>
          </tr>
        </thead>
        <tbody>
          {companyCoupons.length === 0 && (
            <tr><td colSpan={9} className="empty">No company coupons yet.</td></tr>
          )}
          {companyCoupons.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td className="mono">{c.campaignId}</td>
              <td>{c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
              <td>{c.applicableOn}</td>
              <td>₹{c.minOrderValue}</td>
              <td>{c.validFrom} → {c.validTo}</td>
              <td>{c.maxUses}</td>
              <td>{c.maxUsesPerCustomer}</td>
              <td>{usageCount(c.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
