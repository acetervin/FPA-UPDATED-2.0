import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AdminSidebar from '@/components/admin/Sidebar';
import { SectionLoading } from '@/components/ui/loading';
import { adminApi } from '@/lib/api';
import { Donation } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export default function AdminDonations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const {
    data: donations,
    isLoading,
    error,
    refetch
  } = useQuery<Donation[]>({
    queryKey: ['admin', 'donations'],
    queryFn: () => adminApi.getDonations(),
  });

    const filteredDonations = donations?.filter(donation => {
    const matchesSearch = donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const donationDate = new Date(donation.createdAt);
      const now = new Date();
      switch (dateFilter) {
        case 'today':
          matchesDate = donationDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = donationDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchesDate = donationDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });  const totalAmount = filteredDonations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Donations</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load donations'}
            </p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Donations</h2>
                <p className="text-neutral-600">Track and manage donations</p>
              </div>
              <Button>
                <i className="fas fa-download mr-2"></i>
                Export CSV
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-neutral-600 mb-2">Total Donations</h3>
                  <p className="text-2xl font-bold text-primary">
                    KES {totalAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-neutral-600 mb-2">Successful Donations</h3>
                  <p className="text-2xl font-bold text-success">
                    {filteredDonations?.filter(d => d.status === 'completed').length || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-neutral-600 mb-2">Pending Donations</h3>
                  <p className="text-2xl font-bold text-warning">
                    {filteredDonations?.filter(d => d.status === 'pending').length || 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading donations..." />
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Cause</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonations?.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{donation.anonymous ? 'Anonymous Donor' : `User #${donation.userId}`}</div>
                              <div className="text-sm text-neutral-600">{donation.transactionId}</div>
                            </div>
                          </TableCell>
                          <TableCell>KES {donation.amount.toLocaleString()}</TableCell>
                          <TableCell>{donation.causeId ? `Cause #${donation.causeId}` : 'General'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${donation.status === 'completed' ? 'bg-success/10 text-success' :
                                donation.status === 'pending' ? 'bg-warning/10 text-warning' :
                                'bg-error/10 text-error'}`}>
                              {donation.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(donation.createdAt).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="mr-2">
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-receipt"></i>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
