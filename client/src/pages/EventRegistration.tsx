import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface IndividualFormData {
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  phone: string;
}

interface OrganizationFormData {
  organizationName: string;
  organizationEmail: string;
  representativeName: string;
  role: string;
  phone: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  date: string;
  endDate: string;
  fee: number;
  location: string;
  maxParticipants: number;
  active: boolean;
}

type RegistrationType = 'individual' | 'organization';

type PaymentGateway = 'pesapal' | 'paypal' | 'mpesa';

interface RegistrationFormData {
  registrationType: RegistrationType;
  individual?: IndividualFormData;
  organization?: OrganizationFormData;
  gateway: PaymentGateway;
}

export default function EventRegistration() {
  const [registrationType, setRegistrationType] = useState<RegistrationType>('individual');
  const [gateway, setGateway] = useState<PaymentGateway>('pesapal');
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    registrationType: 'individual',
    individual: {
      firstName: '',
      middleName: '',
      surname: '',
      email: '',
      phone: ''
    },
    gateway: 'pesapal'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegistrationFormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!event) {
        throw new Error('Event details not loaded');
      }
      // Always update formData.gateway before sending
      const response = await initiatePayment({ ...formData, gateway }, event);
      if (response.success) {
        toast({
          title: "Registration Initiated",
          description: "Please complete the payment process",
        });
        window.location.href = response.paymentUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationTypeChange = (type: RegistrationType) => {
    setRegistrationType(type);
    setFormData(prev => ({
      registrationType: type,
      gateway: prev.gateway, // always preserve gateway
      ...(type === 'individual'
        ? {
            individual: {
              firstName: '',
              middleName: '',
              surname: '',
              email: '',
              phone: ''
            },
            organization: undefined
          }
        : {
            organization: {
              organizationName: '',
              organizationEmail: '',
              representativeName: '',
              role: '',
              phone: ''
            },
            individual: undefined
          }
      )
    }));
  };

  const handleIndividualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegistrationFormData) => ({
      ...prev,
      individual: {
        ...prev.individual!,
        [name]: value
      }
    }));
  };

  const handleOrganizationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegistrationFormData) => ({
      ...prev,
      organization: {
        ...prev.organization!,
        [name]: value
      }
    }));
  };

  // Fetch event details directly from events table
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    
    const fetchEvent = async () => {
      if (!name) {
        toast({
          title: "Error",
          description: "Event name not provided",
          variant: "destructive",
        });
        return;
      }

      try {
        const res = await fetch(`/api/events/by-name/${encodeURIComponent(name)}`);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();
        
        // Check if the event has ended
        const now = new Date();
        const eventEndDate = new Date(data.endDate);
        
        if (now > eventEndDate) {
          data.active = false; // Mark the event as inactive if it has ended
        }
        
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(true);
        toast({
          title: "Error",
          description: "Failed to load event details.",
          variant: "destructive",
        });
      }
    };

    fetchEvent();
  }, []);

  if (!event) {
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="mb-8">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h2 className="text-3xl font-bold mb-4">Unable to Load Event</h2>
              <p className="text-gray-600 mb-8">
                We're having trouble loading this event. This could be because:
              </p>
              <ul className="text-gray-600 mb-8 list-disc list-inside">
                <li>The event has ended or been removed</li>
                <li>There might be a temporary connection issue</li>
                <li>The event URL might be incorrect</li>
              </ul>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Please try again later or contact our support team if the problem persists.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="default"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/contact'}
                    variant="outline"
                  >
                    Contact Support
                  </Button>
                    <Button 
                    onClick={() => window.location.href = '/blog?category=events'}
                    variant="outline"
                    >
                    ← Back to Blog
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container mx-auto py-10 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="h-[60vh] bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden animate-fade-in">
          <OptimizedImage 
            src={event.imageUrl} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-24 md:py-32 mt-16 sm:mt-0">
          <ScrollAnimationWrapper className="w-full">
            <div className="max-w-4xl transform transition-all">
              {/* Status Badge */}
            {!event.active ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-500/20 text-red-200 mb-6 shadow-lg">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-nowrap">Event Ended</span>
              </span>
            ) : event.maxParticipants ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-200 mb-6 shadow-lg">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-nowrap">Registration Open</span>
              </span>
            ) : null}
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{event.name}</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg bg-black/30 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registration Fee</p>
                  <p className="font-semibold">KES {event.fee.toLocaleString()}</p>
                </div>
              </div>
            </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="container mx-auto py-16 px-4">
        <ScrollAnimationWrapper className="w-full">
          <div className="text-center mb-12 transform transition-all">
            <h2 className="text-3xl font-bold mb-4">Register for {event.name}</h2>
            {event.active ? (
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete the registration form below to secure your spot at this event. 
                Choose between individual or organization registration.
              </p>
            ) : null}
          </div>
        </ScrollAnimationWrapper>
        
        <ScrollAnimationWrapper className="w-full" delay={200}>
          <Card className="p-6 max-w-2xl mx-auto shadow-xl bg-white transform transition-all hover:shadow-2xl duration-300">
            <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{event.name}</h2>
          {!event.active && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              This event has ended and is no longer accepting registrations.
            </div>
          )}
          <p className="text-gray-600 mb-4">{event.description}</p>
          {event.imageUrl && (
            <OptimizedImage src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-lg mb-4" />
          )}
          <div className="space-y-2">
            <p className="text-lg font-medium">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-lg">End Time: {new Date(event.endDate).toLocaleTimeString()}</p>
            <p className="text-lg">Location: {event.location}</p>
            {event.maxParticipants && (
              <p className="text-lg">Maximum Participants: {event.maxParticipants}</p>
            )}
          </div>
        </div>

        {event.active && (
          <div className="mb-6">
            <div className="flex gap-4 mb-6 flex-wrap sm:flex-nowrap">
              <Button
                type="button"
                variant={registrationType === 'individual' ? 'default' : 'outline'}
                onClick={() => handleRegistrationTypeChange('individual')}
                className="w-full sm:w-auto"
              >
                Individual Registration
              </Button>
              <Button
                type="button"
                variant={registrationType === 'organization' ? 'default' : 'outline'}
                onClick={() => handleRegistrationTypeChange('organization')}
                className="w-full sm:w-auto"
              >
                Organization Registration
              </Button>

            </div>
          </div>
        )}

        {event.active && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Gateway Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Payment Gateway</label>
              <select
                className="block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={gateway}
                onChange={e => {
                  setGateway(e.target.value as PaymentGateway);
                  setFormData(prev => ({ ...prev, gateway: e.target.value as PaymentGateway }));
                }}
                required
              >
                <option value="pesapal">Pesapal</option>
                <option value="paypal">PayPal</option>
                <option value="mpesa">M-Pesa</option>
              </select>
            </div>
            {registrationType === 'individual' ? (
            // Individual registration form
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Surname</label>
                  <Input
                    type="text"
                    name="surname"
                    value={formData.individual?.surname || ''}
                    onChange={handleIndividualInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.individual?.firstName || ''}
                    onChange={handleIndividualInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Middle Name</label>
                  <Input
                    type="text"
                    name="middleName"
                    value={formData.individual?.middleName || ''}
                    onChange={handleIndividualInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.individual?.email || ''}
                  onChange={handleIndividualInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.individual?.phone || ''}
                  onChange={handleIndividualInputChange}
                  required
                  placeholder="254700000000"
                />
              </div>
            </>
          ) : (
            // Organization registration form
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <Input
                  type="text"
                  name="organizationName"
                  value={formData.organization?.organizationName || ''}
                  onChange={handleOrganizationInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Organization Email</label>
                <Input
                  type="email"
                  name="organizationEmail"
                  value={formData.organization?.organizationEmail || ''}
                  onChange={handleOrganizationInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Representative Name</label>
                <Input
                  type="text"
                  name="representativeName"
                  value={formData.organization?.representativeName || ''}
                  onChange={handleOrganizationInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Input
                  type="text"
                  name="role"
                  value={formData.organization?.role || ''}
                  onChange={handleOrganizationInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.organization?.phone || ''}
                  onChange={handleOrganizationInputChange}
                  required
                  placeholder="254700000000"
                />
              </div>
            </>
          )}

            <div className="border-t pt-4">
              <p className="text-lg font-semibold mb-4">
                Registration Fee: KES {event.fee}
              </p>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Register & Pay Now"}
              </Button>
            </div>
          </form>
        )}
        </Card>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}

// This function will handle the payment initiation with the selected gateway
async function initiatePayment(formData: RegistrationFormData, event: Event) {
  const response = await fetch('/api/payments/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formData,
      eventId: event.id,
      amount: event.fee,
      gateway: formData.gateway,
    }),
  });

  if (!response.ok) {
    throw new Error('Payment initiation failed');
  }

  return response.json();
}
