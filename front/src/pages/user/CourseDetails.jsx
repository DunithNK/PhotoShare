import { useState, useEffect } from "react";
import {
  Book,
  Award,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function CourseDetailPage() {
  const [expandedModule, setExpandedModule] = useState(null);
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const decoded = jwtDecode(token);
  const role = decoded.role;

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/courses/${courseId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    getCourseDetails();
  }, [courseId]);

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-16 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
          <div className="flex items-center space-x-2 mb-8">
            <User size={20} />
            <span className="text-lg">{data.instructorName}</span>
          </div>
          <div className="bg-white text-blue-600 inline-flex items-center px-6 py-3 rounded-lg font-bold shadow-lg">
            <DollarSign size={24} />
            <span className="text-2xl ml-1">{data.price}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Book className="mr-3 text-blue-600" size={24} />
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {data.description}
              </p>
            </section>

            {/* Outcomes Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Award className="mr-3 text-blue-600" size={24} />
                What You'll Learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.outcomes.map((outcome) => (
                  <div key={outcome.outcomeId} className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mr-3 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">{outcome.description}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Modules Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="border rounded-lg overflow-hidden">
                {data.modules.map((module, index) => (
                  <div
                    key={module.moduleId}
                    className="border-b last:border-b-0"
                  >
                    <button
                      onClick={() => toggleModule(index)}
                      className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-left">
                        {module.title}
                      </span>
                      {expandedModule === index ? (
                        <ChevronUp className="text-blue-600" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-500" size={20} />
                      )}
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

          {
            /* Right Column - Enrollment Card */
            role==="user" && (
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  <h3 className="text-xl font-bold mb-4">Enroll Now</h3>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold">${data.price}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">Instructor:</span>
                      <span>{data.instructorName}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-4"></div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-700">
                        <CheckCircle
                          className="text-green-500 mr-2 flex-shrink-0"
                          size={16}
                        />
                        <span>Full lifetime access</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle
                          className="text-green-500 mr-2 flex-shrink-0"
                          size={16}
                        />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle
                          className="text-green-500 mr-2 flex-shrink-0"
                          size={16}
                        />
                        <span>Project files included</span>
                      </li>
                    </ul>
                  </div>
                  <motion.button
                    className="w-full bg-black hover:bg-black text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enroll in Course
                  </motion.button>
                  <p className="text-center text-gray-500 text-sm mt-4">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
