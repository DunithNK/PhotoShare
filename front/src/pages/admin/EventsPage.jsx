import { Eye, Edit, Trash, Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAddEventPage = location.pathname.includes("/add-events");
  const isEditEventPage = location.pathname.includes("edit-event")
  const isEventDetailsPage = location.pathname.includes("/event-details");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced filtering state
  const [filters, setFilters] = useState({
    searchTerm: "",
    mode: "all",
    minAttendees: 0,
    maxAttendees: 1000,
  });

  

  

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]:
        name === "searchTerm"
          ? value
          : name === "mode"
          ? value
          : Number(value),
    }));
  };

  if (isAddEventPage || isEventDetailsPage || isEditEventPage) {
    return <Outlet />;
  }

  if (loading) {
    return <div className="text-center py-4">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">All Events</h3>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/admin/events/add-events")}
        >
          <Plus size={16} className="mr-2" />
          Create Event
        </button>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <input
            type="text"
            name="searchTerm"
            placeholder="Search events..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mode Filter */}
        <select
          name="mode"
          value={filters.mode}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Events</option>
          <option value="online">Online Events</option>
          <option value="physical">Physical Events</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.organizer}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(event.date)}
                  <div className="text-sm text-gray-500">
                    {event.mode === "online" ? "Online" : "Physical"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{event.attendees}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/admin/events/event-details/${event.id}`)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => navigate(`/admin/events/edit-event/${event.id}`)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Results Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No events found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}