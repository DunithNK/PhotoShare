import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  Users,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  currentSection,
}) {
  const [expandedSection, setExpandedSection] = useState(currentSection);
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const role = decode.role
  const root_admin = role === "root_admin"
  const course_admin = role === "course_admin"
  const event_admin = role === "event_admin"
  const skill_admin = role === "skill_admin"
  

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-700"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {/* Course Admin Section */}
          {(root_admin || course_admin) && (
            <li className="mb-1">
            <div
              className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 ${
                expandedSection === "courses" ? "bg-gray-700" : ""
              }`}
              onClick={() => toggleSection("courses")}
            >
              <div className="flex items-center">
                <BookOpen size={20} />
                {isSidebarOpen && <span className="ml-3">Course Admin</span>}
              </div>
              {isSidebarOpen &&
                (expandedSection === "courses" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </div>
            {expandedSection === "courses" && isSidebarOpen && (
              <ul className="bg-gray-900 py-2">
                <li>
                  <NavLink
                    to="/admin/courses"
                    className={({ isActive }) =>
                      `px-10 py-2 block cursor-pointer hover:bg-gray-700 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    All Courses
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/instructors"
                    className={({ isActive }) =>
                      `px-10 py-2 block cursor-pointer hover:bg-gray-700 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    Instructors
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          )}
          {/* Event Admin Section */}
         {(root_admin || event_admin) && (
           <li className="mb-1">
            <div
              className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 ${
                expandedSection === "events" ? "bg-gray-700" : ""
              }`}
              onClick={() => toggleSection("events")}
            >
              <div className="flex items-center">
                <Calendar size={20} />
                {isSidebarOpen && <span className="ml-3">Event Admin</span>}
              </div>
              {isSidebarOpen &&
                (expandedSection === "events" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </div>
            {expandedSection === "events" && isSidebarOpen && (
              <ul className="bg-gray-900 py-2">
                <li>
                  <NavLink
                    to="/admin/events"
                    className={({ isActive }) =>
                      `px-10 py-2 block cursor-pointer hover:bg-gray-700 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    All Events
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/organizers"
                    className={({ isActive }) =>
                      `px-10 py-2 block cursor-pointer hover:bg-gray-700 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    Organizers
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
         )}

          {/* Skills Share Admin Section */}
          {(root_admin || skill_admin) && (
            <li className="mb-1">
            <div
              className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 ${
                expandedSection === "skills" ? "bg-gray-700" : ""
              }`}
              onClick={() => toggleSection("skills")}
            >
              <div className="flex items-center">
                <Users size={20} />
                {isSidebarOpen && (
                  <span className="ml-3">Skills Share Admin</span>
                )}
              </div>
              {isSidebarOpen &&
                (expandedSection === "skills" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </div>
            {expandedSection === "skills" && isSidebarOpen && (
              <ul className="bg-gray-900 py-2">
                <li>
                  <NavLink
                    to="/admin/skills"
                    className={({ isActive }) =>
                      `px-10 py-2 block cursor-pointer hover:bg-gray-700 ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    All Posts
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
