// Static mock reference data used across the demo (no backend).

export const GURUS = [
  { id: "guru-ravi", name: "Guru Ravi" },
  { id: "guru-priya", name: "Guru Priya" },
  { id: "guru-anand", name: "Guru Anand" },
];

export const CUSTOMERS = [
  { id: "cust-meena", name: "Meena" },
  { id: "cust-sanjay", name: "Sanjay" },
  { id: "cust-farah", name: "Farah" },
];

export const PURCHASE_TYPES = {
  CONSULTATION: "consultation",
  PRODUCT: "product",
};

// Mock prices for the two purchase types available at checkout.
export const MOCK_PRICES = {
  [PURCHASE_TYPES.CONSULTATION]: 500,
  [PURCHASE_TYPES.PRODUCT]: 800,
};

export const APPLICABLE_ON_OPTIONS = [
  { value: "both", label: "Both (Consultation + Product)" },
  { value: PURCHASE_TYPES.CONSULTATION, label: "Consultation only" },
  { value: PURCHASE_TYPES.PRODUCT, label: "Product only" },
];

export const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "flat", label: "Flat (₹)" },
];
