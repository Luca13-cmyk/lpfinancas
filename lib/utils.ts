import dayjs from "dayjs";

export const formatCurrency = (value: number, currency = "BRL"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const CATEGORY_COLORS = ["#f5c542", "#e8def8", "#b8d4e3", "#b8e8d0"];

const SUBSCRIPTION_COLORS = [
  "#ff6b6b",
  "#b8d4e3",
  "#e8def8",
  "#f5c542",
  "#95e1d3",
  "#d4d4d4",
];

/**
 * Retorna uma cor aleatória da lista
 */
export const getRandomColor = (type: "subscription" | "category") => {
  if (type === "subscription") {
    const randomIndex = Math.floor(Math.random() * SUBSCRIPTION_COLORS.length);
    return SUBSCRIPTION_COLORS[randomIndex];
  } else if (type === "category") {
    const randomIndex = Math.floor(Math.random() * CATEGORY_COLORS.length);
    return CATEGORY_COLORS[randomIndex];
  }
};
