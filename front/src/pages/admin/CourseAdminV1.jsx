import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Save,
  User,
  BookOpen,
  Award,
  DollarSign,
  Star,
  List,
  FileText,
  Image,
} from "lucide-react";

export default function CourseAdmin() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("instructors");
  const [instructorFormVisible, setInstructorFormVisible] = useState(false);
  const [courseFormVisible, setCourseFormVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    courseDetails: true,
    modules: true,
    outcomes: true,
  });

  const [instructor, setInstructor] = useState({
    name: "",
    bio: "",
    email: "",
    profileImage: "",
  });

  const [instructors, setInstructors] = useState(null);

  const [course, setCourse] = useState({
    title: "",
    instructorId: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [modules, setModules] = useState([
    { title: "", sequence: 1, topics: [{ title: "", sequence: 1 }] },
  ]);

  const [outcomes, setOutcomes] = useState([{ description: "", sequence: 1 }]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        sequence: modules.length + 1,
        topics: [{ title: "", sequence: 1 }],
      },
    ]);
  };

  const addTopic = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topics.push({
      title: "",
      sequence: updatedModules[moduleIndex].topics.length + 1,
    });
    setModules(updatedModules);
  };

  const addOutcome = () => {
    setOutcomes([
      ...outcomes,
      { description: "", sequence: outcomes.length + 1 },
    ]);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const updateTopic = (moduleIndex, topicIndex, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topics[topicIndex].title = value;
    setModules(updatedModules);
  };

  const updateOutcome = (index, value) => {
    const updatedOutcomes = [...outcomes];
    updatedOutcomes[index].description = value;
    setOutcomes(updatedOutcomes);
  };

  const handleBackButton = (event) => {
    // Show confirmation dialog
    const confirmLogout = window.confirm(
      "Are you sure you want to leave? You will be logged out."
    );

    if (confirmLogout) {
      // User confirmed, proceed with logout
      localStorage.removeItem("token");
      navigate("/home");
    } else {
      // User canceled, prevent the navigation
      // We need to push a new entry to the history to prevent the back navigation
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  useEffect(() => {
    const getInsructors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/instructors",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );
        console.log(response.data[0]);
        setInstructors(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getInsructors();
    window.history.pushState(null, "", window.location.pathname);

    // Add event listener for browser back button
    window.addEventListener("popstate", handleBackButton);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  
  

  // Sample instructors for dropdown

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Photography Course Management</h1>
          <p className="mt-2 opacity-80">
            Add and manage photography courses and instructors
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === "instructors"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("instructors")}
          >
            <User className="inline mr-2 h-5 w-5" />
            Instructors
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === "courses"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="inline mr-2 h-5 w-5" />
            Courses
          </button>
        </div>

        {activeTab === "instructors" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Instructors</h2>
              <button
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => setInstructorFormVisible(!instructorFormVisible)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Instructor
              </button>
            </div>

            {instructorFormVisible && (
              <form
                onSubmit={handleInstructorSubmit}
                className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  New Instructor
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
                      setInstructor({
                        ...instructor,
                        profileImage: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setInstructorFormVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Instructor
                  </button>
                </div>
              </form>
            )}

            {instructors && instructors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.instructorId}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    onClick={() =>
                      navigate(`/instructors/${instructor.instructorId}`)
                    }
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {instructor.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center p-8">
                Instructors will appear here after they are added
              </div>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
              <button
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => setCourseFormVisible(!courseFormVisible)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Course
              </button>
            </div>

            {courseFormVisible && (
              <form
                onSubmit={handleCourseSubmit}
                className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  New Course
                </h3>

                {/* Course Details Section */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                    onClick={() => toggleSection("courseDetails")}
                  >
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                      Course Details
                    </h4>
                    {expandedSections.courseDetails ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {expandedSections.courseDetails && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className="block text-gray-700 mb-2"
                            htmlFor="courseTitle"
                          >
                            Course Title
                          </label>
                          <input
                            id="courseTitle"
                            type="text"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Beginner Photography Basics"
                            value={course.title}
                            onChange={(e) =>
                              setCourse({ ...course, title: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 mb-2"
                            htmlFor="instructor"
                          >
                            Instructor
                          </label>
                          <select
                            id="instructor"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={course.instructorId}
                            onChange={(e) =>
                              setCourse({
                                ...course,
                                instructorId: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select an instructor</option>
                            {instructors.map((instructor) => (
                              <option
                                key={instructor.instructorId}
                                value={instructor.instructorId}
                              >
                                {instructor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label
                            className="block text-gray-700 mb-2"
                            htmlFor="price"
                          >
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            Price ($)
                          </label>
                          <input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="49.99"
                            value={course.price}
                            onChange={(e) =>
                              setCourse({ ...course, price: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 mb-2"
                            htmlFor="imageUrl"
                          >
                            <Image className="h-4 w-4 inline mr-1" />
                            Image URL
                          </label>
                          <input
                            id="imageUrl"
                            type="url"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                            value={course.imageUrl}
                            onChange={(e) =>
                              setCourse({ ...course, imageUrl: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="description"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows="4"
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Course description..."
                          value={course.description}
                          onChange={(e) =>
                            setCourse({
                              ...course,
                              description: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modules Section */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                    onClick={() => toggleSection("modules")}
                  >
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <List className="h-5 w-5 mr-2 text-blue-500" />
                      Course Modules
                    </h4>
                    {expandedSections.modules ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {expandedSections.modules && (
                    <div className="p-4">
                      {modules.map((module, moduleIndex) => (
                        <div
                          key={moduleIndex}
                          className="mb-8 border-b pb-6 last:border-b-0"
                        >
                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h5 className="font-medium text-blue-800 mb-3">
                              Module {moduleIndex + 1}
                            </h5>
                            <input
                              type="text"
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Module title"
                              value={module.title}
                              onChange={(e) =>
                                updateModule(
                                  moduleIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              required
                            />

                            <div className="mt-4">
                              <h6 className="font-medium text-gray-700 mb-2">
                                Topics
                              </h6>
                              {module.topics.map((topic, topicIndex) => (
                                <div
                                  key={topicIndex}
                                  className="flex items-start mt-2"
                                >
                                  <span className="text-gray-500 mt-2 mr-2">
                                    {topicIndex + 1}.
                                  </span>
                                  <input
                                    type="text"
                                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Topic title"
                                    value={topic.title}
                                    onChange={(e) =>
                                      updateTopic(
                                        moduleIndex,
                                        topicIndex,
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                className="mt-3 flex items-center text-blue-600 hover:text-blue-800"
                                onClick={() => addTopic(moduleIndex)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Topic
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={addModule}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Module
                      </button>
                    </div>
                  )}
                </div>

                {/* Learning Outcomes Section */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                    onClick={() => toggleSection("outcomes")}
                  >
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-500" />
                      Learning Outcomes
                    </h4>
                    {expandedSections.outcomes ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {expandedSections.outcomes && (
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">
                        What students will learn from this course:
                      </p>

                      {outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start mt-2">
                          <span className="text-gray-500 mt-2 mr-2">
                            {index + 1}.
                          </span>
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Master camera settings like aperture, shutter speed, and ISO"
                            value={outcome.description}
                            onChange={(e) =>
                              updateOutcome(index, e.target.value)
                            }
                            required
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                        onClick={addOutcome}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Learning Outcome
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setCourseFormVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Course
                  </button>
                </div>
              </form>
            )}

            {/* Course list would go here */}
            <div className="text-gray-500 text-center p-8">
              Courses will appear here after they are added
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
