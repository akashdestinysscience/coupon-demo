import { createContext, useContext, useEffect, useState } from "react";

// Acts as our shared "database" for the whole demo, backed by localStorage
// so state survives refreshes and is shared across every page/tab of the app.

const DataContext = createContext(null);

const STORAGE_KEY = "coupon-engine-demo:v1";

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load stored data, starting fresh.", e);
  }
  return { coupons: [], usages: [] };
}

export function DataProvider({ children }) {
  const [coupons, setCoupons] = useState(() => loadInitialState().coupons);
  const [usages, setUsages] = useState(() => loadInitialState().usages);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ coupons, usages }));
  }, [coupons, usages]);

  function addCoupon(coupon) {
    setCoupons((prev) => [...prev, coupon]);
  }

  function addUsage(usage) {
    setUsages((prev) => [...prev, usage]);
  }

  function resetAll() {
    setCoupons([]);
    setUsages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = { coupons, usages, addCoupon, addUsage, resetAll };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
