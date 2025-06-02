import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calculateEMI } from '../utils/calculations';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';
import { StatBox } from './ui/StatBox';
import { InputGroup } from './ui/InputGroup';

type DashboardProps = {
  loanData: LoanData;
  updateLoanData: (newData: Partial<LoanData>) => void;
};

export const Dashboard = ({ loanData, updateLoanData }: DashboardProps) => {
  const {
    originalPrincipal,
    currentOutstanding,
    interestRate,
    tenure,
    accruedInterest
  } = loanData;

  const handleInputChange = (field: keyof LoanData, value: string) => {
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) return;

    // Validation rules
    let validatedValue = numericValue;
    switch(field) {
      case 'originalPrincipal':
        validatedValue = Math.max(100000, Math.min(10000000, numericValue));
        break;
      case 'currentOutstanding':
        validatedValue = Math.max(100000, Math.min(10000000, numericValue));
        break;
      case 'interestRate':
        validatedValue = Math.max(1, Math.min(20, numericValue));
        break;
      case 'tenure':
        validatedValue = Math.max(12, Math.min(360, numericValue));
        break;
    }

    updateLoanData({ [field]: validatedValue });
  };

  const emiScenario1 = calculateEMI(originalPrincipal, interestRate, tenure);
  const emiScenario2 = calculateEMI(currentOutstanding, interestRate, tenure);
  const emiDifference = emiScenario2 - emiScenario1;
  const monthlyInterest = (currentOutstanding * interestRate) / (12 * 100);
  const totalSavings = emiDifference * tenure;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="📊 Loan Overview">
          <div className="grid grid-cols-2 gap-4">
            <StatBox 
              label="Original Principal" 
              value={formatCurrency(originalPrincipal)} 
            />
            <StatBox 
              label="Current Outstanding" 
              value={formatCurrency(currentOutstanding)} 
            />
            <StatBox 
              label="Accrued Interest" 
              value={formatCurrency(accruedInterest)} 
            />
            <StatBox 
              label="Current Rate" 
              value={formatPercent(interestRate)} 
            />
          </div>
        </Card>
        
        <Card title="⚙️ Loan Parameters">
          <div className="space-y-4">
            <InputGroup
              label="Principal Amount"
              type="number"
              value={originalPrincipal.toString()}
              onChange={(e) => handleInputChange('originalPrincipal', e.target.value)}
              min={100000}
              max={10000000}
              step="1000"
              placeholder="Enter loan amount"
              helperText="Enter amount between ₹1,00,000 and ₹1,00,00,000"
            />
            <InputGroup
              label="Current Outstanding"
              type="number"
              value={currentOutstanding.toString()}
              onChange={(e) => handleInputChange('currentOutstanding', e.target.value)}
              min={100000}
              max={10000000}
              step="1000"
              placeholder="Enter outstanding amount"
            />
            <InputGroup
              label="Interest Rate (%)"
              type="number"
              value={interestRate.toString()}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              min={1}
              max={20}
              step="0.01"
              placeholder="Enter interest rate"
            />
            <InputGroup
              label="Tenure (Months)"
              type="number"
              value={tenure.toString()}
              onChange={(e) => handleInputChange('tenure', e.target.value)}
              min={12}
              max={360}
              step="1"
              placeholder="Enter loan tenure in months"
            />
          </div>
        </Card>
        
        <Card title="💰 Monthly Impact">
          <div className="grid grid-cols-2 gap-4">
            <StatBox 
              label="Current Monthly Interest" 
              value={formatCurrency(monthlyInterest)} 
            />
            <StatBox 
              label="EMI (Pay Interest)" 
              value={formatCurrency(emiScenario1)} 
            />
            <StatBox 
              label="EMI (Add to Principal)" 
              value={formatCurrency(emiScenario2)} 
            />
            <StatBox 
              label="Monthly Savings" 
              value={formatCurrency(emiDifference)} 
              positive={true}
            />
          </div>
        </Card>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 text-center">
        <div className="text-4xl font-bold text-green-700 mb-2">
          {formatCurrency(totalSavings)}
        </div>
        <div className="text-green-800">Total Savings by Paying Interest Upfront</div>
      </div>
    </div>
  );
};