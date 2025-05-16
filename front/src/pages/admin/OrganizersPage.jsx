import { useState, useEffect } from "react";
import { Eye, Edit, Trash, Plus } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

export default function OrganizersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAddOrganizerPage = location.pathname.includes("/add-organizer");
  const isEditOrganizerPage = location.pathname.includes("/edit-organizer");
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Fetch organizers on component mount
  

  // If we're at the add-organizer or edit-organizer route, just render the Outlet
  if (isAddOrganizerPage || isEditOrganizerPage) {
    return <Outlet />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">All Organizers</h3>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            navigate("/admin/organizers/add-organizer");
          }}
        >
          <Plus size={16} className="mr-2" />
          Create Organizer
        </button>
      </div>

      {alert.message && (
        <div
          className={`mb-4 p-3 rounded ${
            alert.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">Loading organizers...</div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizers.map((organizer) => (
                <tr key={organizer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {organizer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {organizer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-yellow-600 hover:text-yellow-800"
                        onClick={() =>
                          navigate(`/admin/organizers/edit-organizer/${organizer.id}`)
                        }
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(organizer.id)}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}