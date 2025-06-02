import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { formatCurrency } from '../utils/formatters';
import { LoanData } from '../types/LoanData';
import { Card } from './ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartsProps = {
  loanData: LoanData;
};

export const Charts = ({ loanData }: ChartsProps) => {
  const { originalPrincipal, currentOutstanding, interestRate, tenure } = loanData;
  
  // Generate data for interest accumulation chart
  const generateInterestData = () => {
    const monthlyRate = interestRate / (12 * 100);
    const emi = (originalPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    const labels = [];
    const principalData = [];
    const interestData = [];
    let remainingPrincipal = originalPrincipal;
    
    for (let month = 0; month <= tenure; month += 12) {
      labels.push(`Year ${Math.floor(month / 12)}`);
      principalData.push(remainingPrincipal);
      
      const yearlyInterest = remainingPrincipal * interestRate / 100;
      interestData.push(yearlyInterest);
      
      // Calculate remaining principal after yearly payment
      const yearlyPayment = emi * 12;
      const interestPortion = remainingPrincipal * (Math.pow(1 + monthlyRate, 12) - 1);
      remainingPrincipal = remainingPrincipal - (yearlyPayment - interestPortion);
    }
    
    return {
      labels,
      principalData,
      interestData
    };
  };

  const interestData = generateInterestData();
  
  const interestChartData = {
    labels: interestData.labels,
    datasets: [
      {
        label: 'Principal',
        data: interestData.principalData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: true,
      },
      {
        label: 'Yearly Interest',
        data: interestData.interestData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        fill: true,
      }
    ]
  };

  const interestChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Interest Accumulation Over Time'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    }
  };

  // EMI Comparison Chart
  const emiScenario1 = (originalPrincipal * (interestRate / 1200) * Math.pow(1 + interestRate / 1200, tenure)) / 
                       (Math.pow(1 + interestRate / 1200, tenure) - 1);
  const emiScenario2 = (currentOutstanding * (interestRate / 1200) * Math.pow(1 + interestRate / 1200, tenure)) / 
                       (Math.pow(1 + interestRate / 1200, tenure) - 1);

  const emiComparisonData = {
    labels: ['Pay Interest Upfront', 'Add to Principal'],
    datasets: [
      {
        data: [emiScenario1, emiScenario2],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };

  const emiComparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'EMI Comparison'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.raw)
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    }
  };

  // Cost Breakdown Chart
  const totalPayment = emiScenario1 * tenure;
  const totalInterest = totalPayment - originalPrincipal;

  const costBreakdownData = {
    labels: ['Principal', 'Total Interest'],
    datasets: [
      {
        data: [originalPrincipal, totalInterest],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };

  const costBreakdownOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${formatCurrency(context.raw)}`
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="📈 Interest Accumulation Over Time" className="lg:col-span-2">
          <div className="h-[300px]">
            <Line data={interestChartData} options={interestChartOptions} />
          </div>
        </Card>
        
        <Card title="🥧 Cost Breakdown">
          <div className="h-[300px]">
            <Pie data={costBreakdownData} options={costBreakdownOptions} />
          </div>
        </Card>
        
        <Card title="📊 EMI Comparison">
          <div className="h-[300px]">
            <Bar data={emiComparisonData} options={emiComparisonOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};