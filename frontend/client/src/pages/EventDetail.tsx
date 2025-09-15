import { useState } from "react";
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
import { MarkdownContent } from "@/components/MarkdownContent";
import { Event } from "@/types/event";
import { EventSupporter } from "@/types/eventSupporter";
import SupporterLogoSlider from "@/components/SupporterLogoSlider";
import { ImageModal } from "@/components/ImageModal";

export default function EventDetail() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`event-${slug}`],
    queryFn: () => getEventBySlug(slug!),
    enabled: !!slug,
  });

  const eventImages = (event as any)?.gallery ?? [];
  const eventPosters = (event as any)?.posters ?? [];
  const eventSupporters = (event as any)?.supporters ?? [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };


  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
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

  const shareEvent = async () => {
    const shareData = {
      title: event?.name || 'Family Peace Association Event',
      text: event?.description || 'Join us for this amazing event!',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.querySelector('[data-share-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Link Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error sharing event:', error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard access failed:', clipboardError);
        alert('Unable to share event. Please copy the URL manually.');
      }
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

      <section className="pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
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
                  
                  <div className="text-xl text-gray-600 mb-6">
                    <MarkdownContent content={event.description} />
                  </div>
                  
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
                      data-share-button
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </div>
                </div>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper>
                <div className="relative mb-8">
                  <OptimizedImage
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </ScrollAnimationWrapper>

              {eventImages && eventImages.length > 0 && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Event Gallery & Special Guests</h2>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                      {eventImages.map((image, index) => (
                        <div key={index} className="relative break-inside-avoid mb-4 cursor-pointer" onClick={() => setSelectedImage(image.imageUrl)}>
                          <OptimizedImage
                            src={image.imageUrl}
                            alt={image.altText || event.name}
                            className="w-full rounded-lg shadow-lg"
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

              {eventPosters && eventPosters.length > 0 && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Event Posters</h2>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                      {eventPosters.map((image, index) => (
                        <div key={index} className="relative break-inside-avoid mb-4 cursor-pointer" onClick={() => setSelectedImage(image.imageUrl)}>
                          <OptimizedImage
                            src={image.imageUrl}
                            alt={image.altText || event.name}
                            className="w-full rounded-lg shadow-lg"
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

              {eventSupporters && eventSupporters.length > 0 && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Event Partners & Supporters</h2>
                    <SupporterLogoSlider supporters={eventSupporters} />
                  </div>
                </ScrollAnimationWrapper>
              )}

              {eventSupporters && eventSupporters.length > 0 && (
                <ScrollAnimationWrapper>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Important Links</h2>
                    <div className="space-y-3">
                      {eventSupporters.map((supporter: EventSupporter) => (
                        <a
                          key={supporter.id}
                          href={supporter.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex-grow font-medium text-gray-800">{supporter.name}</span>
                          <ExternalLink className="w-5 h-5 text-yellow-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              )}

            </div>

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
                          <p className="text-sm text-gray-600">{event.location}</p>.
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

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
          altText="Event Image"
        />
      )}
    </>
  );
}
