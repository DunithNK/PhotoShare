import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Save, User } from "lucide-react";

export default function AddInstructor() {
  const { instructorId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState({
    name: "",
    bio: "",
    email: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (instructorId) {
      const fetchInstructor = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/instructors/${instructorId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data)
          setInstructor({
            name: response.data.name,
            bio: response.data.bio,
            email: response.data.email,
            profileImage: response.data.profileImage,
          });
        } catch (err) {
          setError("Failed to fetch instructor details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchInstructor();
    }
  }, []);

  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Instructor Management</h1>
          <p className="mt-2 opacity-80">
            {instructorId ? "Edit Instructor" : "Add New Instructor"}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {instructorId ? "Edit Instructor" : "New Instructor"}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form
            onSubmit={handleInstructorSubmit}
            className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Instructor Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructor's full name"
                  value={instructor.name}
                  onChange={(e) =>
                    setInstructor({ ...instructor, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email address"
                  value={instructor.email}
                  onChange={(e) =>
                    setInstructor({ ...instructor, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-gray-700 mb-2" htmlFor="bio">
                Biography
              </label>
              <textarea
                id="bio"
                rows="4"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief biography of the instructor"
                value={instructor.bio}
                onChange={(e) =>
                  setInstructor({ ...instructor, bio: e.target.value })
                }
              ></textarea>
            </div>
            <div className="mt-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="profileImage"
              >
                Profile Image URL
              </label>
              <input
                id="profileImage"
                type="url"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
                value={instructor.profileImage}
                onChange={(e) =>
                  setInstructor({ ...instructor, profileImage: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/admin/instructors")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors disabled:bg-green-300"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? "Saving..." : "Save Instructor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}