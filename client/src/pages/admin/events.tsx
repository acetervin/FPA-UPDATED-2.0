import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminSidebar from '@/components/admin/Sidebar';
import { SectionLoading } from '@/components/ui/loading';
import { adminApi } from '@/lib/api';
import { Event } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export default function AdminEvents() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    data: events,
    isLoading,
    error,
    refetch
  } = useQuery<Event[]>({
    queryKey: ['admin', 'events'],
    queryFn: () => adminApi.getEvents(),
  });

  const filteredEvents = events?.filter(event => {
    if (!event) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (event.title?.toLowerCase() || '').includes(searchLower) ||
      (event.description?.toLowerCase() || '').includes(searchLower) ||
      (event.location?.toLowerCase() || '').includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? ['upcoming', 'ongoing'].includes(event.status) : event.status === 'completed' || event.status === 'cancelled');
    
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
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Events</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load events'}
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
                <h2 className="text-2xl font-bold text-neutral-800">Events</h2>
                <p className="text-neutral-600">Manage your events and registrations</p>
              </div>
              <Button>
                <i className="fas fa-plus mr-2"></i>
                New Event
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading events..." />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents?.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                          <OptimizedImage
                            src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ['upcoming', 'ongoing'].includes(event.status) ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                           {statusFilter === 'active' ? 'Active' : 'Inactive'}
                         </span>
                       </div>
                     </div>
                    
                    <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-neutral-600 mb-4">
                        <div className="flex items-center">
                          <i className="fas fa-calendar-alt w-5"></i>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt w-5"></i>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-users w-5"></i>
                          <span>{event.registeredCount} / {event.capacity} registered</span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-error">
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
