import { useState, useEffect } from 'react';

interface CurrencyAmountProps {
  amount: string | number;
  sourceCurrency?: string;
  targetCurrency?: string;
}

export default function CurrencyAmount({ 
  amount, 
  sourceCurrency = 'USD', 
  targetCurrency = 'KES' 
}: CurrencyAmountProps) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConvertedAmount = async () => {
      try {
        const response = await fetch(`/api/currency/convert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(amount),
            from: sourceCurrency,
            to: targetCurrency,
          }),
        });

        const data = await response.json();
        setConvertedAmount(data.amount);
      } catch (error) {
        console.error('Failed to convert currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvertedAmount();
  }, [amount, sourceCurrency, targetCurrency]);

  if (isLoading) {
    return <span>Converting...</span>;
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'KES' ? 0 : 2,
    }).format(amount);
  };

  return (
    <span>
      {formatAmount(Number(amount), sourceCurrency)}
      {convertedAmount && (
        <> ({formatAmount(convertedAmount, targetCurrency)})</>
      )}
    </span>
  );
}
