import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Globe, Monitor } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function EventDetailsPage() {
  const { eventId } = useParams(); // Extract event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  // Fetch event details from backend
  

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return <div className="text-center py-4">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-4 text-gray-500">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Event Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">{event.eventName}</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <div className="flex items-center">
              <User className="mr-2 w-5 h-5" />
              <span>{event.organizer}</span>
            </div>
            <div className="flex items-center">
              {event.mode === 'online' ? (
                <Globe className="mr-2 w-5 h-5" />
              ) : (
                <MapPin className="mr-2 w-5 h-5" />
              )}
              <span>{capitalize(event.mode)} Event</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Event Description</h2>
            <p className="text-gray-600">{event.eventDescription}</p>
          </div>

          {/* Event Metadata */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-700">Date</h3>
                <p className="text-gray-600">{formatDate(event.eventDate)}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-700">Time</h3>
                <p className="text-gray-600">{formatTime(event.eventTime)}</p>
              </div>
            </div>

            {/* Event Mode & Location */}
            {event.mode === 'online' ? (
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Monitor className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-700">Platform</h3>
                  <p className="text-gray-600 capitalize">{event.platform || 'Not specified'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-700">Location</h3>
                  <p className="text-gray-600">{event.place || 'Not specified'}</p>
                </div>
              </div>
            )}

            {/* Event ID */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-700">Event ID</h3>
                <p className="text-gray-600">{event.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}