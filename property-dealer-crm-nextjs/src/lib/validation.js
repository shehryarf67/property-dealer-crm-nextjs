export function validateLeadData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Lead name must be at least 2 characters long");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.push("Valid phone number is required");
  }

  if (!data.propertyInterest || data.propertyInterest.trim().length < 2) {
    errors.push("Property interest is required");
  }

  if (!data.budget || Number(data.budget) <= 0) {
    errors.push("Budget must be greater than 0");
  }

  return errors;
}

export function validateSignupData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (data.role && !["admin", "agent"].includes(data.role)) {
    errors.push("Invalid role selected");
  }

  return errors;
}