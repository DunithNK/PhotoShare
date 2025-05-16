import { useState, useEffect } from "react";
import { Eye, Edit, Trash, Plus } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

export default function InstructorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAddInstructorPage = location.pathname.includes("/add-instructors");
  const isInstructorDetailsPage = location.pathname.includes("/instructor-details");
  const isEditInstructor = location.pathname.includes("/edit-instructor");
  const token = localStorage.getItem("token");
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState(null);

  

  if (isAddInstructorPage || isInstructorDetailsPage || isEditInstructor) {
    return <Outlet />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Instructors</h3>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/admin/instructors/add-instructors")}
        >
          <Plus size={16} className="mr-2" />
          Add Instructors
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

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
            {instructors.map((instructor) => (
              <tr key={instructor.instructorId}>
                <td className="px-6 py-4 whitespace-nowrap">{instructor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{instructor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(`/admin/instructors/instructor-details/${instructor.instructorId}`)
                      }
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() =>
                        navigate(`/admin/instructors/edit-instructor/${instructor.instructorId}`)
                      }
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteInstructor(instructor.instructorId)}
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
    </div>
  );
}