import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

type AmortizationProps = {
  loanData: LoanData;
};

type AmortizationRow = {
  month: number;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
};

export const Amortization = ({ loanData }: AmortizationProps) => {
  const [activeScenario, setActiveScenario] = useState<'scenario1' | 'scenario2' | null>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  
  const generateAmortization = (scenario: 'scenario1' | 'scenario2') => {
    setActiveScenario(scenario);
    
    const { originalPrincipal, currentOutstanding, interestRate, tenure } = loanData;
    const principal = scenario === 'scenario1' ? originalPrincipal : currentOutstanding;
    const monthlyRate = interestRate / (12 * 100);
    
    // Calculate EMI
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    let balance = principal;
    const amortizationSchedule: AmortizationRow[] = [];
    
    for (let month = 1; month <= tenure; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      const endBalance = balance - principalPayment;
      
      amortizationSchedule.push({
        month,
        beginningBalance: balance,
        payment: emi,
        principal: principalPayment,
        interest: interestPayment,
        endingBalance: endBalance
      });
      
      balance = endBalance;
    }
    
    setSchedule(amortizationSchedule);
  };
  
  return (
    <div className="space-y-6">
      <Card title="📋 Amortization Schedule">
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => generateAmortization('scenario1')}
            variant={activeScenario === 'scenario1' ? 'primary' : 'outline'}
          >
            Pay Interest Upfront
          </Button>
          <Button 
            onClick={() => generateAmortization('scenario2')}
            variant={activeScenario === 'scenario2' ? 'primary' : 'outline'}
          >
            Add to Principal
          </Button>
        </div>
        
        {activeScenario ? (
          <div className="max-h-[400px] overflow-y-auto border rounded">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-right">Month</th>
                  <th className="p-3 text-right">Beginning Balance</th>
                  <th className="p-3 text-right">Payment</th>
                  <th className="p-3 text-right">Principal</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-right">{row.month}</td>
                    <td className="p-3 text-right">{formatCurrency(row.beginningBalance)}</td>
                    <td className="p-3 text-right">{formatCurrency(row.payment)}</td>
                    <td className="p-3 text-right">{formatCurrency(row.principal)}</td>
                    <td className="p-3 text-right">{formatCurrency(row.interest)}</td>
                    <td className="p-3 text-right">{formatCurrency(row.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500 bg-gray-50 rounded">
            Select a scenario to view amortization schedule
          </div>
        )}
      </Card>
    </div>
  );
};