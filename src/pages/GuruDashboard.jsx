import { useState } from "react";
import { useData } from "../context/DataContext";
import { CUSTOMERS, GURUS } from "../utils/mockData";

export default function GuruDashboard() {
  const { usages } = useData();
  const [selectedGuruId, setSelectedGuruId] = useState(GURUS[0].id);

  const myUsages = usages.filter(
    (u) => u.sourceType === "guru" && u.guruId === selectedGuruId
  );

  const totalUses = myUsages.length;
  const totalDiscount = myUsages.reduce((sum, u) => sum + u.discountAmount, 0);

  function customerName(id) {
    return CUSTOMERS.find((c) => c.id === id)?.name ?? id;
  }

  return (
    <div className="page">
      <h1>Guru Dashboard — My Coupon Analytics</h1>

      <label className="guru-select">
        Logged in as:
        <select value={selectedGuruId} onChange={(e) => setSelectedGuruId(e.target.value)}>
          {GURUS.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </label>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Uses</span>
          <span className="stat-value">{totalUses}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Discount Given</span>
          <span className="stat-value">₹{totalDiscount.toFixed(2)}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Customer</th>
            <th>Purchase Type</th>
            <th>Discount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {myUsages.length === 0 && (
            <tr><td colSpan={5} className="empty">No usage records yet for this guru.</td></tr>
          )}
          {myUsages.map((u) => (
            <tr key={u.id}>
              <td>{u.code}</td>
              <td>{customerName(u.customerId)}</td>
              <td>{u.purchaseType}</td>
              <td>₹{u.discountAmount.toFixed(2)}</td>
              <td>{new Date(u.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
