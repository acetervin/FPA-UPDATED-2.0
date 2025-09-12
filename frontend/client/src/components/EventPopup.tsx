import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { X, MapPin, Calendar, DollarSign, Clock, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { getEvents } from '@/lib/staticData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Event } from '@/types/event';



const EventPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true); // Always show on page load
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: allEvents, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter for featured and ongoing events
  const events = allEvents?.filter(event => {
    const now = new Date();
    const startDate = new Date(event.date);
    const endDate = new Date(event.endDate);
    
    // Featured events or currently ongoing events
    return event.active && (
      event.featured || 
      (now >= startDate && now <= endDate)
    );
  }) || [];

  const handleNext = useCallback(() => {
    if (events) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }
  }, [events]);

  useEffect(() => {
    if (isPaused || !events || events.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds loop

    return () => clearInterval(timer);
  }, [isPaused, events, handleNext]);

  const handleClose = () => {
    setIsVisible(false);
    // Note: Will reappear on next page reload
  };

  const shareEvent = async (event: any) => {
    const eventUrl = `${window.location.origin}/events/${event.slug}`;
    const shareData = {
      title: event?.name || 'Family Peace Association Event',
      text: event?.description || 'Join us for this amazing event!',
      url: eventUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(eventUrl);
        // Show user feedback for clipboard copy
        const button = document.querySelector('[data-popup-share-button]') as HTMLElement;
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
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(eventUrl);
        alert('Event link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard access failed:', clipboardError);
        alert('Unable to share event. Please copy the URL manually.');
      }
    }
  };

  if (isLoading || error || !events || events.length === 0 || !isVisible) {
    return null;
  }

  const currentEvent = events[currentIndex];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          aria-live="polite"
          aria-atomic="true"
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5 max-w-2xl w-full max-h-[90vh]"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-4">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Close event popup"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">🎉 Don't Miss Out!</h2>
                <p className="text-yellow-100">Featured & Ongoing Events</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <OptimizedImage
                    src={currentEvent.imageUrl || 'https://via.placeholder.com/400x200?text=Event'}
                    alt={currentEvent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  
                  {/* Event Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-600 text-white border-0">
                        {currentEvent.featured ? 'Featured' : 'Live Now'}
                      </Badge>
                      <Badge variant="outline" className="text-white border-white">
                        {currentEvent.category || 'Event'}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 leading-tight">
                      {currentEvent.name}
                    </h3>
                    
                    <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                      {currentEvent.description}
                    </p>
                  </div>

                  {/* Navigation Arrows */}
                  {events.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentIndex(prev => prev === 0 ? events.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Slide Indicators */}
                  {events.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {events.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-600">{formatDate(currentEvent.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-600">{currentEvent.location?.split(',')[0] || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-600">
                        {currentEvent.fee ? `KSh ${currentEvent.fee.toLocaleString()}` : 'Free Event'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/events/${currentEvent.slug}`} className="flex-1">
                      <Button 
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={handleClose}
                      >
                        Learn More & Register
                      </Button>
                    </Link>
                    <div className="flex gap-2 flex-1">
                      <Link href="/events" className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                          onClick={handleClose}
                        >
                          View All Events
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-3"
                        onClick={() => shareEvent(currentEvent)}
                        data-popup-share-button
                        title="Share Event"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {events.length > 1 && (
                    <p className="text-center text-xs text-gray-500 mt-3">
                      Images change every 5 seconds • {currentIndex + 1} of {events.length}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventPopup;
