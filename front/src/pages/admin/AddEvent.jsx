import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Main Event Creation/Edit Component
export default function AddEvent() {
  // State to manage form inputs
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [mode, setMode] = useState('physical');
  const [place, setPlace] = useState('');
  const [platform, setPlatform] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [organizers, setOrganizers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { eventId } = useParams();
  const navigate = useNavigate();

  // JWT token
  const token = localStorage.getItem('token');

  // Fetch organizers and event details (if editing)
  useEffect(() => {
    // Fetch organizers
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/organizer', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const organizerOptions = [
          { value: '', label: 'Select Organizer' },
          ...response.data.map(org => ({
            value: org.id,
            label: org.name,
          })),
        ];
        setOrganizers(organizerOptions);
      } catch (err) {
        setError('Failed to fetch organizers. Please try again.');
        console.error(err);
      }
    };

    

    fetchOrganizers();
    if (eventId) {
      fetchEvent();
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Create event object
    const eventData = {
      title: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      mode,
      platform: mode === 'physical' ? place : platform,
      organizer: organizer ? { id: parseInt(organizer) } : null,
    };

    try {
      if (eventId) {
        // Update existing event
        const response = await axios.put(`http://localhost:8080/api/events/${eventId}`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSuccess('Event updated successfully!');
      } else {
        // Create new event
        const response = await axios.post('http://localhost:8080/api/events', eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSuccess('Event created successfully!');
      }
      resetForm();
      setTimeout(() => navigate('/admin/events'), 1000);
    } catch (err) {
      setError(`Failed to ${eventId ? 'update' : 'create'} event. Please check your input and try again.`);
      console.error(err);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setEventName('');
    setEventDescription('');
    setEventDate('');
    setEventTime('');
    setMode('physical');
    setPlace('');
    setPlatform('');
    setOrganizer('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {eventId ? 'Edit Event' : 'Create New Event'}
        </h1>

        {/* Error and Success Messages */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">
              Event Description
            </label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Event Time */}
          <div>
            <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
              Event Time
            </label>
            <input
              type="time"
              id="eventTime"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Event Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Mode</label>
            <div className="mt-1 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="physical"
                  checked={mode === 'physical'}
                  onChange={() => setMode('physical')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Physical</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="online"
                  checked={mode === 'online'}
                  onChange={() => setMode('online')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Online</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering for Place/Platform */}
          {mode === 'physical' ? (
            <div>
              <label htmlFor="place" className="block text-sm font-medium text-gray-700">
                Place
              </label>
              <input
                type="text"
                id="place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Platform</option>
                <option value="zoom">Zoom</option>
                <option value="google-meet">Google Meet</option>
                <option value="microsoft-teams">Microsoft Teams</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Organizer Dropdown */}
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
              Organizer
            </label>
            <select
              id="organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {organizers.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {eventId ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}