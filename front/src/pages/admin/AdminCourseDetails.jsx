import { useState, useEffect } from "react";
import {
  Book,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  User,
  Calendar,
  Users,
  Edit,
  Eye,
  Clock,
  FileText
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminCourseDetailPage() {
  const [expandedModule, setExpandedModule] = useState(null);
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-4 max-w-5xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Course ID: {courseId}</span>
              <div className="flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center">
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center">
                  <Eye size={16} className="mr-1" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Title Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-200">
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              <span>Instructor: {data.instructorName}</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2" />
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              <span>Enrolled: 0 students</span>
            </div>
            <div className="flex items-center">
              <FileText size={18} className="mr-2" />
              <span>Status: Published</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-3 text-blue-600" size={20} />
                Course Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.description}</p>
            </section>

            {/* Outcomes Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Award className="mr-3 text-blue-600" size={20} />
                Learning Outcomes
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.outcomes.map((outcome) => (
                  <div key={outcome.outcomeId} className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mr-3 mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-gray-700">{outcome.description}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Modules Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <div className="border rounded-lg overflow-hidden">
                {data.modules.map((module, index) => (
                  <div key={module.moduleId} className="border-b last:border-b-0">
                    <button
                      onClick={() => toggleModule(index)}
                      className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-left">
                        {module.title}
                      </span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">
                          {module.topics.length} topics
                        </span>
                        {expandedModule === index ? (
                          <ChevronUp className="text-blue-600" size={18} />
                        ) : (
                          <ChevronDown className="text-gray-500" size={18} />
                        )}
                      </div>
                    </button>
                    {expandedModule === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t">
                        <ul className="space-y-2">
                          {module.topics.map((topic) => (
                            <li
                              key={topic.topicId}
                              className="flex items-center text-gray-700"
                            >
                              <div className="w-1 h-1 bg-gray-500 rounded-full mr-3"></div>
                              {topic.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Admin Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Course ID:</span>
                  <span className="font-medium">{courseId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${data.price}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium">{data.instructorName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">May 10, 2025</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">May 14, 2025</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Published</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Modules:</span>
                  <span className="font-medium">{data.modules.length}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Enrollment:</span>
                  <span className="font-medium">0 students</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">Not rated yet</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Edit Course
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Preview as Student
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}