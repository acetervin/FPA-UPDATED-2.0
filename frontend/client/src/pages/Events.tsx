import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
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
  ChevronRight,
  Filter,
  DollarSign
} from "lucide-react";
import { getEvents } from "@/lib/staticData";
import SEO from "@/components/SEO";
import { Event } from "@/types/event";

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });

  const categories = events 
    ? ["all", ...Array.from(new Set(events.map(event => event.category).filter(Boolean)))]
    : ["all"];

  const filteredEvents = events?.filter(event => {
    if (selectedCategory === "all") return event.active;
    return event.active && event.category === selectedCategory;
  }) || [];

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.endDate) < new Date());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO />
      <Helmet>
        <title>Events - Family Peace Association</title>
        <meta name="description" content="Join our events focused on building stronger families and creating peaceful communities. Find workshops, conferences, and community gatherings." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Family Peace <span className="text-yellow-600">Events</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join us in building stronger families and peaceful communities through workshops, conferences, and meaningful gatherings.
              </p>
              
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category 
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                      : "hover:bg-yellow-50"
                    }
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
            </ScrollAnimationWrapper>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => {
                const status = getEventStatus(event);
                return (
                  <ScrollAnimationWrapper key={event.id}>
                    <Link href={`/events/${event.slug}`} className="block">
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="relative">
                          <OptimizedImage
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className={status.color}>
                              {status.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{event.category}</Badge>
                          {event.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3">{event.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(event.date)} at {formatTime(event.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-4 h-4 mr-2" />
                            KSh {event.fee.toLocaleString()}
                          </div>
                          {event.maxParticipants && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-2" />
                              Max {event.maxParticipants} participants
                            </div>
                          )}
                        </div>
                        
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollAnimationWrapper>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
            </ScrollAnimationWrapper>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <ScrollAnimationWrapper key={event.id}>
                  <Link href={`/events/${event.slug}`} className="block">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <OptimizedImage
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3">{event.category}</Badge>
                      <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <h2 className="text-3xl font-bold text-center mb-12">Past Events</h2>
            </ScrollAnimationWrapper>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.slice(0, 8).map((event) => (
                <ScrollAnimationWrapper key={event.id}>
                  <Link href={`/events/${event.slug}`} className="block">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow opacity-75 cursor-pointer">
                      <OptimizedImage
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-32 object-cover"
                      />
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 text-sm">{event.name}</h4>
                        <div className="text-xs text-gray-500">
                          {formatDate(event.date)}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-yellow-600">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-yellow-100 mb-8 max-w-2xl mx-auto">
              Don't miss out on our upcoming events. Subscribe to our newsletter to stay updated on all Family Peace Association activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved">
                <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
                  Get Involved
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}