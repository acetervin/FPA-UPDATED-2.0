import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


interface Payment {
  id: string;
  orderId?: string;
  transactionId?: string;
  amount: number;
  status: string;
  createdAt: string;
  gateway: 'paypal' | 'mpesa';
  payer?: string;
}

export default function AdminPayments() {
  const [gateway, setGateway] = useState<'paypal' | 'mpesa'>('paypal');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch PayPal transactions
  const { data: paypalPayments, isLoading: loadingPaypal, error: errorPaypal, refetch: refetchPaypal } = useQuery<Payment[]>({
    queryKey: ['admin', 'payments', 'paypal', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.append('startDate', dateRange.from.toISOString());
      if (dateRange?.to) params.append('endDate', dateRange.to.toISOString());
      const res = await fetch(`/api/admin/payments/paypal?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch PayPal payments');
      return res.json();
    },
  });

  // Fetch M-Pesa transactions
  const { data: mpesaPayments, isLoading: loadingMpesa, error: errorMpesa, refetch: refetchMpesa } = useQuery<Payment[]>({
    queryKey: ['admin', 'payments', 'mpesa', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.append('startDate', dateRange.from.toISOString());
      if (dateRange?.to) params.append('endDate', dateRange.to.toISOString());
      const res = await fetch(`/api/admin/payments/mpesa?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch M-Pesa payments');
      return res.json();
    },
  });

  const handleDownload = async () => {
    const payments = gateway === 'paypal' ? paypalPayments : mpesaPayments;
    if (!payments || payments.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${gateway.toUpperCase()} Transactions`);

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Order/Transaction ID', key: 'txId', width: 35 },
      { header: 'Payer', key: 'payer', width: 30 },
      { header: 'Amount (KES)', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'createdAt', width: 25 },
    ];

    const formattedData = payments.map((tx: Payment) => ({
      id: tx.id,
      txId: tx.orderId || tx.transactionId || tx.id,
      payer: tx.payer || '-',
      amount: tx.amount,
      status: tx.status,
      createdAt: new Date(tx.createdAt).toLocaleString(),
    }));

    worksheet.addRows(formattedData);

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${gateway}-transactions.xlsx`);
  };

  return (

    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Payment Gateways</h2>
                <p className="text-neutral-600">View and manage PayPal & M-Pesa transactions</p>
              </div>
              <div className="flex gap-2">
                <Button variant={gateway === 'paypal' ? 'default' : 'outline'} onClick={() => setGateway('paypal')}>PayPal</Button>
                <Button variant={gateway === 'mpesa' ? 'default' : 'outline'} onClick={() => setGateway('mpesa')}>M-Pesa</Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
              <Button onClick={handleDownload} disabled={(gateway === 'paypal' ? !paypalPayments : !mpesaPayments) || (gateway === 'paypal' ? paypalPayments?.length === 0 : mpesaPayments?.length === 0)}>
                <i className="fas fa-download mr-2"></i>
                Download Report
              </Button>
            </div>
          </header>

          <div className="p-6 space-y-8">

            {gateway === 'paypal' ? (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">PayPal Transactions</h3>
                  {loadingPaypal ? (
                    <div>Loading PayPal payments...</div>
                  ) : errorPaypal ? (
                    <div className="text-error mb-4">{errorPaypal.message}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border">
                        <thead>
                          <tr>
                            <th className="text-left p-2 border-b">Order ID</th>
                            <th className="text-left p-2 border-b">Payer</th>
                            <th className="text-left p-2 border-b">Amount</th>
                            <th className="text-left p-2 border-b">Status</th>
                            <th className="text-left p-2 border-b">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paypalPayments?.map((tx) => (
                            <tr key={tx.id} className="border-b hover:bg-neutral-100">
                              <td className="p-2">{tx.orderId || tx.id}</td>
                              <td className="p-2">{tx.payer || '-'}</td>
                              <td className="p-2">KES {tx.amount.toLocaleString()}</td>
                              <td className="p-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  tx.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                                  tx.status === 'PENDING' ? 'bg-warning/10 text-warning' :
                                  'bg-error/10 text-error'
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <Button className="mt-4" onClick={() => refetchPaypal()}>Refresh</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">M-Pesa Transactions</h3>
                  {loadingMpesa ? (
                    <div>Loading M-Pesa payments...</div>
                  ) : errorMpesa ? (
                    <div className="text-error mb-4">{errorMpesa.message}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border">
                        <thead>
                          <tr>
                            <th className="text-left p-2 border-b">Transaction ID</th>
                            <th className="text-left p-2 border-b">Payer</th>
                            <th className="text-left p-2 border-b">Amount</th>
                            <th className="text-left p-2 border-b">Status</th>
                            <th className="text-left p-2 border-b">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mpesaPayments?.map((tx) => (
                            <tr key={tx.id} className="border-b hover:bg-neutral-100">
                              <td className="p-2">{tx.transactionId || tx.id}</td>
                              <td className="p-2">{tx.payer || '-'}</td>
                              <td className="p-2">KES {tx.amount.toLocaleString()}</td>
                              <td className="p-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  tx.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                                  tx.status === 'PENDING' ? 'bg-warning/10 text-warning' :
                                  'bg-error/10 text-error'
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <Button className="mt-4" onClick={() => refetchMpesa()}>Refresh</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
