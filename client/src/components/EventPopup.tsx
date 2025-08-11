import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { getFeaturedActiveEvents } from '../lib/api';
import type { Event } from '../types/admin';
import { Button } from './ui/button';



const EventPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(
    sessionStorage.getItem('eventPopupClosed') !== 'true'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: events, isLoading, error } = useQuery<any[]>({
    queryKey: ['featuredActiveEvents'],

    queryFn: getFeaturedActiveEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    sessionStorage.setItem('eventPopupClosed', 'true');
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
          className="fixed bottom-5 right-5 w-full max-w-sm z-50"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          aria-live="polite"
          aria-atomic="true"
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-1.5 z-20 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all"
              aria-label="Close event popup"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={currentEvent.imageUrl || 'https://via.placeholder.com/400x200?text=Event'}
                    alt={currentEvent.title}

                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h3 className="absolute bottom-3 left-4 right-4 text-white text-xl font-bold leading-tight">
                    {currentEvent.title}
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{currentEvent.location}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Calendar size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        {formatDate(currentEvent.date)}
                      </span>

                    </li>
                    <li className="flex items-start gap-2.5">
                      <DollarSign size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Free Event
                      </span>

                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Deadline: {formatDate(currentEvent.date)}</span>

                    </li>
                  </ul>

                  <Button asChild className="w-full !mt-4" size="lg">
                    <Link to={`/event-registration/${currentEvent.slug}`}>
                      Register Now
                    </Link>
                  </Button>
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
