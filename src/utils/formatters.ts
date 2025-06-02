/**
 * Format number as currency (Indian Rupee)
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number as percentage
 * @param value Percentage value
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Format number with commas for Indian number system
 * @param num Number to format
 * @returns Formatted number string
 */
export function formatIndianNumber(num: number): string {
  const numStr = num.toString();
  let result = '';
  
  // Handle the part before decimal point
  const beforeDecimal = numStr.split('.')[0];
  const afterDecimal = numStr.split('.')[1] || '';
  
  let i = beforeDecimal.length - 1;
  let count = 0;
  
  while (i >= 0) {
    count++;
    result = beforeDecimal.charAt(i) + result;
    
    if (count === 3 && i !== 0) {
      result = ',' + result;
      count = 0;
    } else if (count === 2 && i !== 0 && result.charAt(0) === ',') {
      result = ',' + result;
      count = 0;
    }
    
    i--;
  }
  
  // Add the decimal part if it exists
  if (afterDecimal) {
    result += '.' + afterDecimal;
  }
  
  return result;
}