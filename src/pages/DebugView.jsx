import { useData } from "../context/DataContext";
import { CUSTOMERS, GURUS } from "../utils/mockData";

export default function DebugView() {
  const { usages, coupons, resetAll } = useData();

  function customerName(id) {
    return CUSTOMERS.find((c) => c.id === id)?.name ?? id;
  }

  function guruName(id) {
    return GURUS.find((g) => g.id === id)?.name ?? id;
  }

  function sourceLabel(u) {
    return u.sourceType === "company" ? u.campaignId : guruName(u.guruId);
  }

  const sorted = [...usages].sort((a, b) => new Date(b.date) - new Date(a.date));

  function handleReset() {
    if (confirm("This will clear all coupons and usage data. Continue?")) {
      resetAll();
    }
  }

  return (
    <div className="page">
      <h1>Global Debug View — All Coupon Usage</h1>
      <p className="subtitle">
        {coupons.length} coupon(s) created · {usages.length} usage record(s) logged
      </p>

      <button className="btn-secondary" onClick={handleReset}>Reset all data</button>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Source Type</th>
            <th>Campaign / Guru</th>
            <th>Customer</th>
            <th>Purchase Type</th>
            <th>Order Value</th>
            <th>Discount Given</th>
            <th>Final Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr><td colSpan={9} className="empty">No usage records yet.</td></tr>
          )}
          {sorted.map((u) => (
            <tr key={u.id}>
              <td>{u.code}</td>
              <td>
                <span className={`badge badge-${u.sourceType}`}>{u.sourceType}</span>
              </td>
              <td className="mono">{sourceLabel(u)}</td>
              <td>{customerName(u.customerId)}</td>
              <td>{u.purchaseType}</td>
              <td>₹{u.orderValue}</td>
              <td>₹{u.discountAmount.toFixed(2)}</td>
              <td>₹{u.finalAmount.toFixed(2)}</td>
              <td>{new Date(u.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
