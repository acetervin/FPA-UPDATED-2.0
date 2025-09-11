import { useQuery } from '@tanstack/react-query';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { adminApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { SectionLoading } from '@/components/ui/loading';
import AdminSidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';

export default function AdminEventRegistrations() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'event-registrations'],
    queryFn: () => adminApi.getEventRegistrations(),
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const handleDownload = async () => {


    if (!data) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Event Registrations');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Event ID', key: 'eventId', width: 10 },
      { header: 'Type', key: 'registrationType', width: 15 },
      { header: 'Name/Organization', key: 'nameOrg', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Registration Date', key: 'createdAt', width: 25 },
    ];

    const formattedData = data.map((reg: any) => ({
      id: reg.id,
      eventId: reg.eventId,
      registrationType: reg.registrationType,
      nameOrg:
        reg.registrationType === 'individual'
          ? `${reg.surname} ${reg.firstName} ${reg.middleName}`
          : reg.organizationName,
      email: reg.email,
      phone: reg.phone,
      paymentStatus: reg.paymentStatus,
      amount: reg.amount,
      createdAt: new Date(reg.createdAt).toLocaleString(),
    }));

    worksheet.addRows(formattedData);

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'event-registrations.xlsx');
  };


  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <SectionLoading message="Loading registrations..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <Card className="max-w-lg mx-auto mt-10">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
              </div>
              <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Registrations</h1>
              <p className="text-neutral-600 mb-4">
                {error instanceof Error ? error.message : 'Failed to load registrations'}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Event Registrations</h2>
            <p className="text-neutral-500">View and manage all event registrations.</p>
          </div>
          <Button onClick={handleDownload} disabled={!data || data.length === 0}>
            <i className="fas fa-download mr-2"></i>
            Download as XLSX
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Event ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name/Org</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {data?.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-neutral-500">
                        <i className="fas fa-list-alt text-4xl mb-2"></i>
                        <p>No registrations found.</p>
                      </td>
                    </tr>
                  ) : (
                    data?.map((reg: any) => (
                      <tr key={reg.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 whitespace-nowrap">{reg.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{reg.eventId}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{reg.registrationType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {reg.registrationType === 'individual'
                            ? `${reg.surname} ${reg.firstName} ${reg.middleName}`
                            : reg.organizationName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{reg.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{reg.phone}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{reg.paymentStatus}</td>
                        <td className="px-4 py-3 whitespace-nowrap">KES {reg.amount}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(reg.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
