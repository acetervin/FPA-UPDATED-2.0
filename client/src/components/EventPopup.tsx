import React from 'react';

interface Event {
  name: string;
  description: string;
  date: string;
  image_url: string;
}

interface EventPopupProps {
  event: Event;
  onClose: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
        {event.image_url && <img src={event.image_url} alt={event.name} className="w-full h-48 object-cover mb-4" />}
        <p className="mb-4">{event.description}</p>
        <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default EventPopup;
