/**
 * Calculate EMI (Equated Monthly Installment)
 * @param principal Loan principal amount
 * @param rate Annual interest rate (percentage)
 * @param tenure Loan tenure in months
 * @returns Monthly EMI amount
 */
export function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi;
}

/**
 * Calculate total payment over the loan tenure
 * @param emi Monthly EMI amount
 * @param tenure Loan tenure in months
 * @returns Total payment over the tenure
 */
export function calculateTotalPayment(emi: number, tenure: number): number {
  return emi * tenure;
}

/**
 * Calculate monthly interest amount
 * @param principal Current principal amount
 * @param rate Annual interest rate (percentage)
 * @returns Monthly interest amount
 */
export function calculateMonthlyInterest(principal: number, rate: number): number {
  return (principal * rate) / (12 * 100);
}

/**
 * Calculate tax savings based on interest and tax bracket
 * @param interest Interest amount
 * @param taxBracket Tax bracket percentage
 * @returns Tax savings amount
 */
export function calculateTaxSavings(interest: number, taxBracket: number): number {
  return (interest * taxBracket) / 100;
}