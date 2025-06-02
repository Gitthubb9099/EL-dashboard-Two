import React, { useMemo } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';
import { StatBox } from './ui/StatBox';

type TaxBenefitsProps = {
  loanData: LoanData;
};

export const TaxBenefits = ({ loanData }: TaxBenefitsProps) => {
  const { interestRate, originalPrincipal, taxBracket } = loanData;
  
  // Calculate first year interest (approximation)
  const firstYearInterest = originalPrincipal * interestRate / 100;
  const taxSavings = firstYearInterest * taxBracket / 100;
  
  // Generate multi-year tax projection
  const taxProjection = useMemo(() => {
    const years = 5; // Show first 5 years
    const projection = [];
    let remainingPrincipal = originalPrincipal;
    
    for (let year = 1; year <= years; year++) {
      const yearlyInterest = remainingPrincipal * interestRate / 100;
      const yearlyTaxSaving = yearlyInterest * taxBracket / 100;
      
      // Simulate principal reduction each year
      remainingPrincipal = remainingPrincipal * 0.95; // Simplified assumption of 5% reduction per year
      
      projection.push({
        year,
        yearlyInterest,
        taxDeduction: yearlyInterest,
        taxSaving: yearlyTaxSaving
      });
    }
    
    return projection;
  }, [originalPrincipal, interestRate, taxBracket]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="🏛️ Tax Deduction Analysis">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatBox 
                label="FY 2024-25 Interest" 
                value={formatCurrency(firstYearInterest)} 
              />
              <StatBox 
                label={`Tax Savings (${taxBracket}%)`} 
                value={formatCurrency(taxSavings)} 
                positive={true}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="border rounded-lg p-4 text-center bg-gray-50">
                <div className="font-bold text-gray-700">5% Bracket</div>
                <div className="text-green-600 mt-1">
                  {formatCurrency(firstYearInterest * 0.05)}
                </div>
              </div>
              <div className="border rounded-lg p-4 text-center bg-gray-50">
                <div className="font-bold text-gray-700">20% Bracket</div>
                <div className="text-green-600 mt-1">
                  {formatCurrency(firstYearInterest * 0.20)}
                </div>
              </div>
              <div className="border rounded-lg p-4 text-center bg-gray-50">
                <div className="font-bold text-gray-700">30% Bracket</div>
                <div className="text-green-600 mt-1">
                  {formatCurrency(firstYearInterest * 0.30)}
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="📅 Multi-Year Tax Benefits">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 bg-gray-50">Year</th>
                  <th className="text-left py-2 px-4 bg-gray-50">Interest Paid</th>
                  <th className="text-left py-2 px-4 bg-gray-50">Tax Deduction</th>
                  <th className="text-left py-2 px-4 bg-gray-50">Tax Savings ({taxBracket}%)</th>
                </tr>
              </thead>
              <tbody>
                {taxProjection.map((item) => (
                  <tr key={item.year} className="border-b">
                    <td className="py-2 px-4">Year {item.year}</td>
                    <td className="py-2 px-4">{formatCurrency(item.yearlyInterest)}</td>
                    <td className="py-2 px-4">{formatCurrency(item.taxDeduction)}</td>
                    <td className="py-2 px-4 text-green-600">{formatCurrency(item.taxSaving)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-2 px-4">Total</td>
                  <td className="py-2 px-4">
                    {formatCurrency(taxProjection.reduce((sum, item) => sum + item.yearlyInterest, 0))}
                  </td>
                  <td className="py-2 px-4">
                    {formatCurrency(taxProjection.reduce((sum, item) => sum + item.taxDeduction, 0))}
                  </td>
                  <td className="py-2 px-4 text-green-600">
                    {formatCurrency(taxProjection.reduce((sum, item) => sum + item.taxSaving, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};