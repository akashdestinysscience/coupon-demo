import { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { CUSTOMERS } from "../utils/mockData";

export default function AdminDashboard() {
  const { usages } = useData();
  const [campaignFilter, setCampaignFilter] = useState("all");

  const companyUsages = usages.filter((u) => u.sourceType === "company");
  const campaignIds = [...new Set(companyUsages.map((u) => u.campaignId))];

  const filteredUsages = useMemo(
    () =>
      campaignFilter === "all"
        ? companyUsages
        : companyUsages.filter((u) => u.campaignId === campaignFilter),
    [companyUsages, campaignFilter]
  );

  const totalUses = filteredUsages.length;
  const totalDiscount = filteredUsages.reduce((sum, u) => sum + u.discountAmount, 0);

  function customerName(id) {
    return CUSTOMERS.find((c) => c.id === id)?.name ?? id;
  }

  return (
    <div className="page">
      <h1>Admin Dashboard — Campaign Analytics</h1>

      <label className="guru-select">
        Filter by campaign:
        <select value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)}>
          <option value="all">All campaigns</option>
          {campaignIds.map((id) => (
            <option key={id} value={id}>{id}</option>
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
            <th>Campaign ID</th>
            <th>Customer</th>
            <th>Purchase Type</th>
            <th>Discount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsages.length === 0 && (
            <tr><td colSpan={6} className="empty">No usage records yet.</td></tr>
          )}
          {filteredUsages.map((u) => (
            <tr key={u.id}>
              <td>{u.code}</td>
              <td className="mono">{u.campaignId}</td>
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
