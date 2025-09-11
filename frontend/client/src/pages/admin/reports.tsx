import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminSidebar from '@/components/admin/Sidebar';
import { SectionLoading } from '@/components/ui/loading';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { adminApi } from '@/lib/api';

interface ReportData {
  donations: {
    totalAmount: number;
    byMonth: { month: string; amount: number }[];
    byCategory: { category: string; amount: number }[];
  };
  events: {
    totalAttendees: number;
    byEvent: { event: string; attendees: number }[];
    registrationTrend: { date: string; count: number }[];
  };
  volunteers: {
    totalHours: number;
    byActivity: { activity: string; hours: number }[];
    activeVolunteers: number;
  };
}

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('all');

  const { data, isLoading, error } = useQuery<ReportData>({
    queryKey: ['admin', 'reports', timeRange],
    queryFn: () => adminApi.getReports(timeRange),
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await adminApi.exportReport(timeRange, format);
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${timeRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Reports</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load reports'}
            </p>
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
                <h2 className="text-2xl font-bold text-neutral-800">Reports & Analytics</h2>
                <p className="text-neutral-600">View and analyze organization performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  <i className="fas fa-file-csv mr-2"></i>
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  <i className="fas fa-file-pdf mr-2"></i>
                  Export PDF
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="donations">Donations</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="volunteers">Volunteers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading reports..." />
            ) : data ? (
              <div className="grid gap-6">
                {/* Donations Section */}
                {(reportType === 'all' || reportType === 'donations') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Donations Overview</CardTitle>
                      <CardDescription>Track donation trends and patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-[300px]">
                          <LineChart
                            data={data.donations.byMonth}
                            xField="month"
                            yField="amount"
                            title="Donations by Month"
                          />
                        </div>
                        <div className="h-[300px]">
                          <PieChart
                            data={data.donations.byCategory}
                            nameField="category"
                            valueField="amount"
                            title="Donations by Category"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Events Section */}
                {(reportType === 'all' || reportType === 'events') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Events Performance</CardTitle>
                      <CardDescription>Track event attendance and engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-[300px]">
                          <BarChart
                            data={data.events.byEvent}
                            xField="event"
                            yField="attendees"
                            title="Attendance by Event"
                          />
                        </div>
                        <div className="h-[300px]">
                          <LineChart
                            data={data.events.registrationTrend}
                            xField="date"
                            yField="count"
                            title="Registration Trend"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Volunteers Section */}
                {(reportType === 'all' || reportType === 'volunteers') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Volunteer Engagement</CardTitle>
                      <CardDescription>Track volunteer activities and impact</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-[300px]">
                          <PieChart
                            data={data.volunteers.byActivity}
                            nameField="activity"
                            valueField="hours"
                            title="Hours by Activity"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <h3 className="text-sm font-medium text-neutral-600 mb-2">
                                Total Volunteer Hours
                              </h3>
                              <p className="text-2xl font-bold text-primary">
                                {data.volunteers.totalHours}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <h3 className="text-sm font-medium text-neutral-600 mb-2">
                                Active Volunteers
                              </h3>
                              <p className="text-2xl font-bold text-success">
                                {data.volunteers.activeVolunteers}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
