import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './SideBar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Extract the current section from the URL path
  const getCurrentSection = () => {
    const path = location.pathname.split('/')[1] || 'courses';
    return path;
  };

  // Get page title based on current section
  const getPageTitle = () => {
    const section = getCurrentSection();
    switch(section) {
      case 'courses':
        return 'Course Administration';
      case 'events':
        return 'Event Administration';
      case 'skills':
        return 'Skills Share Administration';
      default:
        return 'Administration Dashboard';
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentSection={getCurrentSection()}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h2>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}