import React, { useState, useEffect } from 'react';
import { Tabs } from './Tabs';
import { Dashboard } from './Dashboard';
import { EmiCalculator } from './EmiCalculator';
import { Amortization } from './Amortization';
import { TaxBenefits } from './TaxBenefits';
import { CashFlow } from './CashFlow';
import { Sensitivity } from './Sensitivity';
import { Charts } from './Charts';
import { LoanData } from '../types/LoanData';

export const Calculator = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loanData, setLoanData] = useState<LoanData>({
    originalPrincipal: 1775000,
    currentOutstanding: 1965994,
    interestRate: 8.15,
    tenure: 180,
    taxBracket: 30,
    accruedInterest: 190994,
  });

  const updateLoanData = (newData: Partial<LoanData>) => {
    setLoanData(prev => ({ ...prev, ...newData }));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'emi-calculator', label: 'EMI Calculator', icon: '🔄' },
    { id: 'amortization', label: 'Amortization', icon: '📋' },
    { id: 'tax-benefits', label: 'Tax Benefits', icon: '🏛️' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💸' },
    { id: 'sensitivity', label: 'Sensitivity Analysis', icon: '⚙️' },
    { id: 'charts', label: 'Visual Analysis', icon: '📈' },
  ];

  return (
    <div className="container max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="header bg-gradient-to-r from-slate-800 to-blue-700 text-white p-8 text-center">
        <h1 className="text-4xl font-light mb-2">Education Loan Analysis Dashboard</h1>
        <p className="text-lg opacity-90">Comprehensive analysis and planning tool for your education loan</p>
      </div>
      
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="p-6">
        {activeTab === 'dashboard' && <Dashboard loanData={loanData} updateLoanData={updateLoanData} />}
        {activeTab === 'emi-calculator' && <EmiCalculator loanData={loanData} />}
        {activeTab === 'amortization' && <Amortization loanData={loanData} />}
        {activeTab === 'tax-benefits' && <TaxBenefits loanData={loanData} />}
        {activeTab === 'cashflow' && <CashFlow loanData={loanData} />}
        {activeTab === 'sensitivity' && <Sensitivity loanData={loanData} />}
        {activeTab === 'charts' && <Charts loanData={loanData} />}
      </div>
    </div>
  );
};