import { Eye, Edit, Trash, Plus } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CoursesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAddCoursePage = location.pathname.includes("/add-courses");
  const isCourseDetailsPage = location.pathname.includes("/course-details");
  const isCourseEditPage = location.pathname.includes("/edit-course");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

 
  if (isAddCoursePage || isCourseDetailsPage || isCourseEditPage) {
    return <Outlet />;
  }

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">All Courses</h3>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            navigate("/admin/courses/add-courses");
          }}
        >
          <Plus size={16} className="mr-2" />
          Create Course
        </button>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.instructorName}{" "}
                  {/* Update this based on how you want to display instructor */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${course.price.toString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(
                          `/admin/courses/course-details/${course.courseId}`
                        )
                      }
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() =>
                        navigate(
                          `/admin/courses/edit-course/${course.courseId}`
                        )
                      }
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(course.courseId)}
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
