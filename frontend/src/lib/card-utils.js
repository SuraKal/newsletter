export const stripCardNumber = (value) =>
  String(value || "").replace(/\D/g, "").slice(0, 19);

export const formatCardNumber = (value) => {
  const digits = stripCardNumber(value);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

export const formatExpiry = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const formatCvc = (value) =>
  String(value || "").replace(/\D/g, "").slice(0, 4);

export const isLuhnValid = (number) => {
  const digits = stripCardNumber(number);
  if (digits.length < 13) {
    return false;
  }
  let sum = 0;
  let doubleDigit = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
};

export const cardBrandFor = (number) => {
  const digits = stripCardNumber(number);
  if (/^3[47]/.test(digits)) {
    return "Amex";
  }
  if (/^4/.test(digits)) {
    return "Visa";
  }
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)) {
    return "Mastercard";
  }
  return "Card";
};

export const isExpiryValid = (month, year) => {
  const current = new Date();
  const currentMonth = current.getMonth() + 1;
  const currentYear = current.getFullYear();

  let normalizedYear = year;
  if (String(year).length === 2) {
    normalizedYear = 2000 + Number(year);
  }

  if (!normalizedYear || normalizedYear < currentYear - 2000) {
    return false;
  }
  if (normalizedYear > currentYear + 30) {
    return false;
  }
  if (normalizedYear < currentYear) {
    return false;
  }
  if (normalizedYear === currentYear && Number(month) < currentMonth) {
    return false;
  }
  return Number(month) >= 1 && Number(month) <= 12;
};

export const maskCardNumber = (number) => {
  const digits = stripCardNumber(number);
  if (!digits.length) {
    return "";
  }
  return `•••• ${digits.slice(-4)}`;
};