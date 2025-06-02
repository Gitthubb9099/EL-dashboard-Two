import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { calculateEMI, calculateTotalPayment } from '../utils/calculations';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';
import { StatBox } from './ui/StatBox';

type EmiCalculatorProps = {
  loanData: LoanData;
};

export const EmiCalculator = ({ loanData }: EmiCalculatorProps) => {
  const { originalPrincipal, currentOutstanding, interestRate, tenure, accruedInterest } = loanData;
  
  const emiScenario1 = calculateEMI(originalPrincipal, interestRate, tenure);
  const emiScenario2 = calculateEMI(currentOutstanding, interestRate, tenure);
  
  const totalPayment1 = calculateTotalPayment(emiScenario1, tenure);
  const totalPayment2 = calculateTotalPayment(emiScenario2, tenure);
  
  const totalInterest1 = totalPayment1 - originalPrincipal;
  const totalInterest2 = totalPayment2 - currentOutstanding;
  
  // Estimate number of months to break even
  const monthlyDifference = emiScenario2 - emiScenario1;
  const monthsToBreakeven = monthlyDifference > 0 ? Math.ceil(accruedInterest / monthlyDifference) : Infinity;
  
  // Calculate the proportion of interest to principal
  const interestRatio = totalInterest1 / totalPayment1 * 100;
  
  return (
    <div className="space-y-6">
      <Card title="🔄 EMI Comparison">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-gray-50">Scenario</th>
                <th className="text-left py-3 px-4 bg-gray-50">Principal</th>
                <th className="text-left py-3 px-4 bg-gray-50">EMI</th>
                <th className="text-left py-3 px-4 bg-gray-50">Total Payment</th>
                <th className="text-left py-3 px-4 bg-gray-50">Interest Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 border-b">
                <td className="py-3 px-4 font-medium">Pay Interest Upfront</td>
                <td className="py-3 px-4">{formatCurrency(originalPrincipal)}</td>
                <td className="py-3 px-4">{formatCurrency(emiScenario1)}</td>
                <td className="py-3 px-4">{formatCurrency(totalPayment1)}</td>
                <td className="py-3 px-4">{formatCurrency(totalInterest1)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Add to Principal</td>
                <td className="py-3 px-4">{formatCurrency(currentOutstanding)}</td>
                <td className="py-3 px-4">{formatCurrency(emiScenario2)}</td>
                <td className="py-3 px-4">{formatCurrency(totalPayment2)}</td>
                <td className="py-3 px-4">{formatCurrency(totalInterest2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="📊 Payment Breakdown">
          <div className="space-y-4">
            <StatBox 
              label="Upfront Interest Payment" 
              value={formatCurrency(accruedInterest)} 
            />
            <div className="mt-4">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-700" 
                  style={{ width: `${interestRatio}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Interest ({Math.round(interestRatio)}%) vs Principal ({Math.round(100 - interestRatio)}%) Ratio
              </p>
            </div>
          </div>
        </Card>
        
        <Card title="⏰ Time Analysis">
          <div className="grid grid-cols-3 gap-4">
            <StatBox 
              label="Total Months" 
              value={tenure.toString()} 
            />
            <StatBox 
              label="Years" 
              value={(tenure / 12).toFixed(1)} 
            />
            <StatBox 
              label="Months to Breakeven" 
              value={isFinite(monthsToBreakeven) ? monthsToBreakeven.toString() : 'N/A'} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};