import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Add/Edit Organizer Component
export default function AddOrganizer() {
  // State to manage form inputs
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { organizerId } = useParams();
  const navigate = useNavigate();
 

  // Fetch organizer details if organizerId is present
  useEffect(() => {
    if (organizerId) {
      const fetchOrganizer = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }

          const response = await axios.get(
            `http://localhost:8080/api/organizer/${organizerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { name, email } = response.data;
          setName(name);
          setContactEmail(email);
        } catch (error) {
          console.error("Error fetching organizer:", error);
          setErrorMessage(
            error.response?.data?.message ||
              error.message ||
              "Failed to fetch organizer details."
          );
        }
      };

      fetchOrganizer();
    }
  }, [organizerId]);

  // Handle form submission
  

  // Reset form fields
  const resetForm = () => {
    setName("");
    setContactEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {organizerId ? "Edit Organizer" : "Add New Organizer"}
        </h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organizer Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Organizer Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Contact Email */}
          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {isSubmitting
                ? organizerId
                  ? "Updating..."
                  : "Creating..."
                : organizerId
                ? "Update Organizer"
                : "Create Organizer"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
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
