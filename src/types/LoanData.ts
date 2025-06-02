export interface LoanData {
  originalPrincipal: number;
  currentOutstanding: number;
  interestRate: number;
  tenure: number;
  taxBracket: number;
  accruedInterest: number;
}