import { useState } from 'react';
import PayPalClient from '../components/PayPalClient';

export default function DonationTest() {
    const [amount, setAmount] = useState<number>(10);
    const [status, setStatus] = useState<string>('');

    const handleSuccess = (details: any) => {
        setStatus(`Payment completed! Order ID: ${details.id}`);
    };

    const handleError = (error: any) => {
        setStatus(`Error: ${error.message}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Donation Test</h1>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Donation Amount (USD)
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="1"
                    step="1"
                />
            </div>

            <div className="mb-4">
                <PayPalClient
                    amount={amount}
                    description="Test donation"
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            </div>

            {status && (
                <div className="mt-4 p-4 rounded-md bg-gray-100">
                    <p className="text-sm text-gray-900">{status}</p>
                </div>
            )}
        </div>
    );
}
