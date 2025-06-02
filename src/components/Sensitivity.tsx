import React, { useMemo } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calculateEMI } from '../utils/calculations';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';

type SensitivityProps = {
  loanData: LoanData;
};

export const Sensitivity = ({ loanData }: SensitivityProps) => {
  const { originalPrincipal, currentOutstanding, interestRate, tenure } = loanData;
  
  // Generate interest rate sensitivity analysis
  const rateSensitivity = useMemo(() => {
    const rateVariations = [-1, -0.5, 0, 0.5, 1, 1.5];
    return rateVariations.map(variation => {
      const newRate = interestRate + variation;
      const emi1 = calculateEMI(originalPrincipal, newRate, tenure);
      const emi2 = calculateEMI(currentOutstanding, newRate, tenure);
      const difference = emi2 - emi1;
      const totalDifference = difference * tenure;
      
      return {
        rate: newRate,
        emi1,
        emi2,
        difference,
        totalDifference
      };
    });
  }, [originalPrincipal, currentOutstanding, interestRate, tenure]);
  
  // Generate tenure sensitivity analysis
  const tenureSensitivity = useMemo(() => {
    const tenureYears = [10, 12, 15, 18, 20];
    return tenureYears.map(years => {
      const tenureMonths = years * 12;
      const emi1 = calculateEMI(originalPrincipal, interestRate, tenureMonths);
      const emi2 = calculateEMI(currentOutstanding, interestRate, tenureMonths);
      const difference = emi2 - emi1;
      const totalDifference = difference * tenureMonths;
      
      return {
        years,
        tenureMonths,
        emi1,
        emi2,
        difference,
        totalDifference
      };
    });
  }, [originalPrincipal, currentOutstanding, interestRate]);
  
  return (
    <div className="space-y-6">
      <Card title="📊 Interest Rate Sensitivity">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-gray-50">Interest Rate</th>
                <th className="text-left py-3 px-4 bg-gray-50">EMI (Pay Upfront)</th>
                <th className="text-left py-3 px-4 bg-gray-50">EMI (Add to Principal)</th>
                <th className="text-left py-3 px-4 bg-gray-50">Monthly Difference</th>
                <th className="text-left py-3 px-4 bg-gray-50">Total Savings</th>
              </tr>
            </thead>
            <tbody>
              {rateSensitivity.map((row) => (
                <tr 
                  key={row.rate} 
                  className={`border-b ${row.rate === interestRate ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-3 px-4 font-medium">{formatPercent(row.rate)}</td>
                  <td className="py-3 px-4">{formatCurrency(row.emi1)}</td>
                  <td className="py-3 px-4">{formatCurrency(row.emi2)}</td>
                  <td className="py-3 px-4">{formatCurrency(row.difference)}</td>
                  <td className="py-3 px-4 text-green-600">{formatCurrency(row.totalDifference)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Card title="⏱️ Tenure Sensitivity">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-gray-50">Tenure (Years)</th>
                <th className="text-left py-3 px-4 bg-gray-50">EMI (Pay Upfront)</th>
                <th className="text-left py-3 px-4 bg-gray-50">EMI (Add to Principal)</th>
                <th className="text-left py-3 px-4 bg-gray-50">Monthly Difference</th>
                <th className="text-left py-3 px-4 bg-gray-50">Total Savings</th>
              </tr>
            </thead>
            <tbody>
              {tenureSensitivity.map((row) => (
                <tr 
                  key={row.years} 
                  className={`border-b ${row.tenureMonths === tenure ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-3 px-4 font-medium">{row.years} years</td>
                  <td className="py-3 px-4">{formatCurrency(row.emi1)}</td>
                  <td className="py-3 px-4">{formatCurrency(row.emi2)}</td>
                  <td className="py-3 px-4">{formatCurrency(row.difference)}</td>
                  <td className="py-3 px-4 text-green-600">{formatCurrency(row.totalDifference)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};