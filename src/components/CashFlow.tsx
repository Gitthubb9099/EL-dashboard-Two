import React, { useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';
import { calculateEMI } from '../utils/calculations';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';
import { StatBox } from './ui/StatBox';

type CashFlowProps = {
  loanData: LoanData;
};

export const CashFlow = ({ loanData }: CashFlowProps) => {
  const { originalPrincipal, currentOutstanding, interestRate, tenure, accruedInterest } = loanData;
  
  const emiScenario1 = calculateEMI(originalPrincipal, interestRate, tenure);
  const emiScenario2 = calculateEMI(currentOutstanding, interestRate, tenure);
  const monthlySavings = emiScenario2 - emiScenario1;
  
  // Calculate break-even point
  const breakEvenMonths = Math.ceil(accruedInterest / monthlySavings);
  const breakEvenYears = (breakEvenMonths / 12).toFixed(1);
  
  // Calculate cumulative savings at different points
  const cumulativeSavings = useMemo(() => {
    const years = [5, 10, 15];
    return years.map(year => {
      const months = year * 12;
      const totalSavings = months * monthlySavings - accruedInterest;
      return {
        year,
        months,
        savings: totalSavings > 0 ? totalSavings : 0
      };
    });
  }, [monthlySavings, accruedInterest]);
  
  // Calculate percentage of tenure for break-even
  const breakEvenPercentage = (breakEvenMonths / tenure) * 100;
  
  return (
    <div className="space-y-6">
      <Card title="💸 Monthly Cash Flow Analysis">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-gray-50">Scenario</th>
                <th className="text-left py-3 px-4 bg-gray-50">Upfront Cost</th>
                <th className="text-left py-3 px-4 bg-gray-50">Monthly EMI</th>
                <th className="text-left py-3 px-4 bg-gray-50">Net Monthly Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 border-b">
                <td className="py-3 px-4 font-medium">Pay Interest Upfront</td>
                <td className="py-3 px-4">{formatCurrency(accruedInterest)}</td>
                <td className="py-3 px-4">{formatCurrency(emiScenario1)}</td>
                <td className="py-3 px-4 text-green-600">+{formatCurrency(monthlySavings)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Add to Principal</td>
                <td className="py-3 px-4">₹0</td>
                <td className="py-3 px-4">{formatCurrency(emiScenario2)}</td>
                <td className="py-3 px-4">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="⚖️ Break-even Analysis">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatBox 
                label="Break-even Months" 
                value={breakEvenMonths.toString()} 
              />
              <StatBox 
                label="Break-even Years" 
                value={breakEvenYears} 
              />
            </div>
            
            <div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500" 
                  style={{ width: `${Math.min(breakEvenPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Break-even point occurs at {Math.round(breakEvenPercentage)}% of loan tenure
              </p>
            </div>
          </div>
        </Card>
        
        <Card title="📈 Cumulative Savings">
          <div className="space-y-4">
            {cumulativeSavings.map((item) => (
              <div key={item.year} className="space-y-2">
                <div className="flex justify-between">
                  <span>After {item.year} years:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(item.savings)}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600" 
                    style={{ width: `${(item.months / tenure) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};