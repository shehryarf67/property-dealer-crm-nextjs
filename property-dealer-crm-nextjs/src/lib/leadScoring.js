export function calculateLeadScore(budget) {
  const numericBudget = Number(budget);

  if (numericBudget > 20000000) {
    return "High";
  }

  if (numericBudget >= 10000000 && numericBudget <= 20000000) {
    return "Medium";
  }

  return "Low";
}