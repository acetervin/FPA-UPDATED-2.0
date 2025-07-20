import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import AdminSidebar from '@/components/admin/Sidebar';
import { SectionLoading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/api';
import { z } from 'zod';

const settingsSchema = z.object({
  general: z.object({
    siteName: z.string().min(1, 'Site name is required'),
    siteDescription: z.string(),
    contactEmail: z.string().email('Invalid email address'),
    contactPhone: z.string(),
    address: z.string(),
  }),
  appearance: z.object({
    logo: z.string().url('Invalid logo URL'),
    favicon: z.string().url('Invalid favicon URL'),
    primaryColor: z.string(),
    secondaryColor: z.string(),
  }),
  social: z.object({
    facebook: z.string().url('Invalid Facebook URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  }),
  email: z.object({
    smtpHost: z.string(),
    smtpPort: z.number(),
    smtpUser: z.string(),
    smtpPassword: z.string(),
    senderName: z.string(),
    senderEmail: z.string().email('Invalid sender email'),
  }),
  payment: z.object({
    pesaPalKey: z.string(),
    pesaPalSecret: z.string(),
    currency: z.string(),
    minimumDonation: z.number(),
  }),
});

type SettingsData = z.infer<typeof settingsSchema>;

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SettingsData>({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminApi.getSettings(),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<SettingsData>) => adminApi.updateSettings(data),
    onSuccess: () => {
      toast({
        title: 'Settings Updated',
        description: 'Your changes have been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update settings',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      // TODO: Implement settings update logic
      await adminApi.updateSettings(data);
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const form = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  if (isLoading) {
    return <SectionLoading message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Settings</h2>
                <p className="text-neutral-600">Configure your website settings</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>
                          Basic information about your website
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="general.siteName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Site Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Your website name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="general.siteDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Site Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Brief description of your website" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="general.contactEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="contact@example.com" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="general.contactPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Phone</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="+254 123 456 789" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="general.address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Your organization's address" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button type="submit">Save Changes</Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Similar structure for other tabs... */}
                  <TabsContent value="appearance">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appearance Settings</CardTitle>
                        <CardDescription>
                          Customize your website's look and feel
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Logo, colors, etc. form fields */}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="social">
                    <Card>
                      <CardHeader>
                        <CardTitle>Social Media Settings</CardTitle>
                        <CardDescription>
                          Connect your social media accounts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Social media links form fields */}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="email">
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Settings</CardTitle>
                        <CardDescription>
                          Configure your email server settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Email configuration form fields */}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="payment">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Settings</CardTitle>
                        <CardDescription>
                          Configure your payment gateway settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Payment gateway form fields */}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
