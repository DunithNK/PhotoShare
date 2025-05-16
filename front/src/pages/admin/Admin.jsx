import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp, BookOpen, Calendar, Users, Edit, Trash, Eye, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('courses');
  const [expandedSection, setExpandedSection] = useState('courses');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const selectSection = (section) => {
    setActiveSection(section);
  };

  // Sample data for demonstration
  const courses = [
    { id: 1, title: 'Introduction to React', instructor: 'John Doe', students: 45 },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', students: 32 },
    { id: 3, title: 'UI/UX Fundamentals', instructor: 'Mike Johnson', students: 28 },
  ];

  const events = [
    { id: 1, title: 'Tech Conference 2025', date: '2025-06-15', attendees: 120 },
    { id: 2, title: 'Web Development Workshop', date: '2025-05-22', attendees: 35 },
    { id: 3, title: 'Design Thinking Seminar', date: '2025-07-03', attendees: 50 },
  ];

  const users = [
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', skills: ['JavaScript', 'React'] },
    { id: 2, name: 'Bob Martinez', email: 'bob@example.com', skills: ['Python', 'Data Analysis'] },
    { id: 3, name: 'Carol White', email: 'carol@example.com', skills: ['UI Design', 'Figma'] },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {/* Course Admin Section */}
            <li className="mb-1">
              <div 
                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 ${expandedSection === 'courses' ? 'bg-gray-700' : ''}`}
                onClick={() => toggleSection('courses')}
              >
                <div className="flex items-center">
                  <BookOpen size={20} />
                  {isSidebarOpen && <span className="ml-3">Course Admin</span>}
                </div>
                {isSidebarOpen && (
                  expandedSection === 'courses' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
              {expandedSection === 'courses' && isSidebarOpen && (
                <ul className="bg-gray-900 py-2">
                  <li 
                    className={`px-10 py-2 cursor-pointer hover:bg-gray-700 ${activeSection === 'courses' ? 'text-blue-400' : ''}`}
                    onClick={() => selectSection('courses')}
                  >
                    All Courses
                  </li>
                </ul>
              )}
            </li>

            {/* Event Admin Section */}
            <li className="mb-1">
              <div 
                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 ${expandedSection === 'events' ? 'bg-gray-700' : ''}`}
                onClick={() => toggleSection('events')}
              >
                <div className="flex items-center">
                  <Calendar size={20} />
                  {isSidebarOpen && <span className="ml-3">Event Admin</span>}
                </div>
                {isSidebarOpen && (
                  expandedSection === 'events' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
              {expandedSection === 'events' && isSidebarOpen && (
                <ul className="bg-gray-900 py-2">
                  <li 
                    className={`px-10 py-2 cursor-pointer hover:bg-gray-700 ${activeSection === 'events' ? 'text-blue-400' : ''}`}
                    onClick={() => selectSection('events')}
                  >
                    All Events
                  </li>
                </ul>
              )}
            </li>

            {/* Skills Share Admin Section */}
            <li className="mb-1">
              <div 
                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 ${expandedSection === 'skills' ? 'bg-gray-700' : ''}`}
                onClick={() => toggleSection('skills')}
              >
                <div className="flex items-center">
                  <Users size={20} />
                  {isSidebarOpen && <span className="ml-3">Skills Share Admin</span>}
                </div>
                {isSidebarOpen && (
                  expandedSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
              {expandedSection === 'skills' && isSidebarOpen && (
                <ul className="bg-gray-900 py-2">
                  <li 
                    className={`px-10 py-2 cursor-pointer hover:bg-gray-700 ${activeSection === 'skills' ? 'text-blue-400' : ''}`}
                    onClick={() => selectSection('skills')}
                  >
                    All Users
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeSection === 'courses' && 'Course Administration'}
              {activeSection === 'events' && 'Event Administration'}
              {activeSection === 'skills' && 'Skills Share Administration'}
            </h2>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Course Admin Section */}
          {activeSection === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">All Courses</h3>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Create Course
                </button>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.instructor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.students}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye size={18} />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
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
          )}

          {/* Event Admin Section */}
          {activeSection === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">All Events</h3>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Create Event
                </button>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map(event => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.attendees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye size={18} />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
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
          )}

          {/* Skills Share Admin Section */}
          {activeSection === 'skills' && (
            <div>
              <div className="flex justify-center mb-6">
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Create Post
                </button>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye size={18} />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
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
          )}
        </main>
      </div>
    </div>
  );
}