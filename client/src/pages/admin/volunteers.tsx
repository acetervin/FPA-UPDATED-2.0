import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
import { useToast } from '@/hooks/use-toast';

interface VolunteerApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  program: string;
  experience: string;
  availability: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminVolunteers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const {
    data: applications,
    isLoading,
    error,
    refetch
  } = useQuery<VolunteerApplication[]>({
    queryKey: ['admin', 'volunteer-applications'],
    queryFn: () => adminApi.getVolunteerApplications(),
  });

  const updateApplicationMutation = useMutation({
    mutationFn: (data: { id: number; status: 'approved' | 'rejected' }) =>
      adminApi.updateVolunteerApplication(data.id, data.status),
    onSuccess: () => {
      toast({
        title: 'Application Updated',
        description: 'The volunteer application has been updated successfully.',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update application',
        variant: 'destructive',
      });
    },
  });

  const handleUpdateStatus = (id: number, status: 'approved' | 'rejected') => {
    updateApplicationMutation.mutate({ id, status });
  };

  const filteredApplications = applications?.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Applications</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load volunteer applications'}
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
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Volunteer Applications</h2>
                <p className="text-neutral-600">Review and manage volunteer applications</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading applications..." />
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications?.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.program}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${app.status === 'approved' ? 'bg-success/10 text-success' :
                                app.status === 'rejected' ? 'bg-error/10 text-error' :
                                'bg-warning/10 text-warning'}`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mr-2 text-success"
                              onClick={() => handleUpdateStatus(app.id, 'approved')}
                              disabled={app.status === 'approved'}
                            >
                              <i className="fas fa-check"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-error"
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              disabled={app.status === 'rejected'}
                            >
                              <i className="fas fa-times"></i>
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
