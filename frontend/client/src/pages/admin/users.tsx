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
import { User } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(),
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Users</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load users'}
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
                <h2 className="text-2xl font-bold text-neutral-800">Users</h2>
                <p className="text-neutral-600">Manage user accounts and roles</p>
              </div>
              <Button>
                <i className="fas fa-plus mr-2"></i>
                Add User
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="donor">Donor</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading users..." />
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.fullName}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${user.role === 'admin' ? 'bg-primary/10 text-primary' :
                                user.role === 'volunteer' ? 'bg-success/10 text-success' :
                                'bg-neutral-100 text-neutral-600'}`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${user.active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="mr-2">
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-error">
                              <i className="fas fa-trash"></i>
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
