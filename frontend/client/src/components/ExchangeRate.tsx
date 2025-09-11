import { useState, useEffect } from 'react';

export default function ExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('/api/currency/convert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 1,
            from: 'USD',
            to: 'KES',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }

        const data = await response.json();
        setRate(data.amount);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
    
    // Refresh rate every hour
    const interval = setInterval(fetchRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 animate-pulse">
        Loading exchange rate...
      </div>
    );
  }

  if (!rate) {
    return null;
  }

  return (
    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md inline-block">
      <span className="font-medium">Current Exchange Rate:</span>
      <br />
      1 USD = {rate.toFixed(2)} KES
    </div>
  );
}
