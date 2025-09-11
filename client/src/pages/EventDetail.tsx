import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ArrowLeft,
  ExternalLink,
  DollarSign,
  Phone,
  Mail,
  Share2
} from "lucide-react";
import { getEventBySlug } from "@/lib/staticData";
import SEO from "@/components/SEO";

interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  date: string;
  endDate: string;
  location: string;
  fee: number;
  maxParticipants?: number;
  imageUrl: string;
  featured: boolean;
  category: string;
  tags?: string[];
  contactEmail?: string;
  contactPhone?: string;
  registrationUrl?: string;
  active: boolean;
}

interface EventImage {
  id: number;
  imageUrl: string;
  caption?: string;
  isPrimary: boolean;
}

interface EventSupporter {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  type: 'sponsor' | 'partner' | 'organizer' | 'supporter';
  level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard';
}

export default function EventDetail() {
  const { slug } = useParams();
  
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`event-${slug}`],
    queryFn: () => getEventBySlug(slug!),
    enabled: !!slug,
  });

  // Sample event images and supporters for demonstration
  const eventImages: EventImage[] = event ? [
    {
      id: 1,
      eventId: event.id,
      imageUrl: event.imageUrl || '/images/events/default-event.jpg',
      altText: event.name,
      isPrimary: true,
      caption: `Main image for ${event.name}`
    },
    {
      id: 2,
      eventId: event.id,
      imageUrl: '/images/events/workshop-1.jpg',
      altText: 'Workshop activities',
      isPrimary: false,
      caption: 'Participants engaging in group activities'
    },
    {
      id: 3,
      eventId: event.id,
      imageUrl: '/images/events/workshop-2.jpg', 
      altText: 'Community involvement',
      isPrimary: false,
      caption: 'Community members participating'
    }
  ] : [];

  const eventSupporters: EventSupporter[] = event ? [
    {
      id: 1,
      eventId: event.id,
      name: 'Community Foundation',
      type: 'organization',
      level: 'platinum',
      logoUrl: '/images/supporters/community-foundation.jpg',
      website: 'https://communityfoundation.org'
    },
    {
      id: 2,
      eventId: event.id,
      name: 'Local Government',
      type: 'government',
      level: 'gold',
      logoUrl: '/images/supporters/local-government.jpg',
      website: 'https://local.gov'
    },
    {
      id: 3,
      eventId: event.id,
      name: 'Peace Initiative Group',
      type: 'organization',
      level: 'silver',
      logoUrl: '/images/supporters/peace-group.jpg',
      website: 'https://peaceinitiative.org'
    }
  ] : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.date);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    if (now >= startDate && now <= endDate) return { status: 'live', color: 'bg-green-100 text-green-800' };
    return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.name,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = getEventStatus(event);

  return (
    <>
      <SEO />
      <Helmet>
        <title>{event.name} - Family Peace Association</title>
        <meta name="description" content={event.description} />
        <meta property="og:title" content={`${event.name} - Family Peace Association`} />
        <meta property="og:description" content={event.description} />
        <meta property="og:image" content={event.imageUrl} />
      </Helmet>

      {/* Breadcrumb */}
      <section className="pt-24 pb-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-yellow-600">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-yellow-600">Events</Link>
            <span>/</span>
            <span className="text-gray-800">{event.name}</span>
          </div>
          
          <Link href="/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ScrollAnimationWrapper>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={status.color}>
                      {status.status}
                    </Badge>
                    <Badge variant="outline">{event.category}</Badge>
                    {event.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {event.name}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-6">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    {event.registrationUrl && (
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                          Register Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    )}
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={shareEvent}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </div>
                </div>
              </ScrollAnimationWrapper>
              
              {/* Event Image */}
              <ScrollAnimationWrapper>
                <div className="relative mb-8">
                  <OptimizedImage
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </ScrollAnimationWrapper>

              {/* Event Gallery */}
              {eventImages && eventImages.length > 0 && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Event Gallery</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventImages.map((image) => (
                        <div key={image.id} className="relative">
                          <OptimizedImage
                            src={image.imageUrl}
                            alt={image.caption || event.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          {image.caption && (
                            <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              )}

              {/* Event Description */}
              {event.fullDescription && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <div className="prose max-w-none text-gray-700">
                      {event.fullDescription.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              )}

              {/* Event Supporters */}
              {eventSupporters && eventSupporters.length > 0 && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Event Partners & Supporters</h2>
                    
                    {/* Group supporters by type */}
                    {['sponsor', 'partner', 'organizer', 'supporter'].map((type) => {
                      const typeSupporters = eventSupporters.filter(s => s.type === type);
                      if (typeSupporters.length === 0) return null;
                      
                      return (
                        <div key={type} className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 capitalize">
                            {type}s
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {typeSupporters.map((supporter) => (
                              <div key={supporter.id} className="text-center">
                                {supporter.logo ? (
                                  <div className="bg-white p-4 rounded-lg shadow border">
                                    <OptimizedImage
                                      src={supporter.logo}
                                      alt={supporter.name}
                                      className="w-20 h-20 object-contain mx-auto mb-2"
                                    />
                                    <p className="text-sm font-medium">{supporter.name}</p>
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 p-4 rounded-lg border">
                                    <p className="text-sm font-medium">{supporter.name}</p>
                                  </div>
                                )}
                                {supporter.website && (
                                  <a 
                                    href={supporter.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-yellow-600 hover:underline mt-1 block"
                                  >
                                    Visit Website
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollAnimationWrapper>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ScrollAnimationWrapper>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Event Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-yellow-600 mt-1" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(event.date)} - {formatTime(event.endDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-yellow-600 mt-1" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <DollarSign className="w-5 h-5 text-yellow-600 mt-1" />
                        <div>
                          <p className="font-medium">Registration Fee</p>
                          <p className="text-sm text-gray-600">
                            KSh {event.fee.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {event.maxParticipants && (
                        <div className="flex items-start space-x-3">
                          <Users className="w-5 h-5 text-yellow-600 mt-1" />
                          <div>
                            <p className="font-medium">Capacity</p>
                            <p className="text-sm text-gray-600">
                              Max {event.maxParticipants} participants
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {(event.contactEmail || event.contactPhone) && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          {event.contactEmail && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a 
                                href={`mailto:${event.contactEmail}`}
                                className="text-sm text-yellow-600 hover:underline"
                              >
                                {event.contactEmail}
                              </a>
                            </div>
                          )}
                          {event.contactPhone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a 
                                href={`tel:${event.contactPhone}`}
                                className="text-sm text-yellow-600 hover:underline"
                              >
                                {event.contactPhone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {event.registrationUrl && (
                      <div className="mt-6">
                        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                            Register Now
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}