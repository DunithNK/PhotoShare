import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Save,
  BookOpen,
  Award,
  DollarSign,
  List,
  Image,
  Trash2,
} from "lucide-react";

export default function AddCourse() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [courseFormVisible, setCourseFormVisible] = useState(true); // Always visible for edit/create
  const [expandedSections, setExpandedSections] = useState({
    courseDetails: true,
    modules: true,
    outcomes: true,
  });
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
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const removeModule = () => {
    if (modules.length > 1) {
      const updatedModules = [...modules];
      updatedModules.pop();
      setModules(updatedModules);
    }
  };

  const addTopic = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topics.push({
      title: "",
      sequence: updatedModules[moduleIndex].topics.length + 1,
    });
    setModules(updatedModules);
  };

  const removeTopic = (moduleIndex) => {
    const updatedModules = [...modules];
    if (updatedModules[moduleIndex].topics.length > 1) {
      updatedModules[moduleIndex].topics.pop();
      setModules(updatedModules);
    }
  };

  const addOutcome = () => {
    setOutcomes([
      ...outcomes,
      { description: "", sequence: outcomes.length + 1 },
    ]);
  };

  const removeOutcome = () => {
    if (outcomes.length > 1) {
      const updatedOutcomes = [...outcomes];
      updatedOutcomes.pop();
      setOutcomes(updatedOutcomes);
    }
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

  // Fetch instructors and course data (if courseId exists)
  useEffect(() => {
    const getInstructors = async () => {
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
        setInstructors(response.data);
      } catch (err) {
        setError("Failed to fetch instructors");
        console.error(err);
      }
    };

    const getCourse = async () => {
      if (!courseId) return;
      setLoading(true);
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
        const courseData = response.data;

        // Populate course details
        setCourse({
          title: courseData.title || "",
          instructorId: courseData.instructorId?.toString() || "",
          price: courseData.price?.toString() || "",
          description: courseData.description || "",
          imageUrl: courseData.imageUrl || "",
        });

        // Populate modules
        const fetchedModules = courseData.modules?.length
          ? courseData.modules.map((module, index) => ({
              title: module.title || "",
              sequence: module.sequence || index + 1,
              topics: module.topics?.length
                ? module.topics.map((topic, tIndex) => ({
                    title: topic.title || "",
                    sequence: topic.sequence || tIndex + 1,
                  }))
                : [{ title: "", sequence: 1 }],
            }))
          : [{ title: "", sequence: 1, topics: [{ title: "", sequence: 1 }] }];
        setModules(fetchedModules);

        // Populate outcomes
        const fetchedOutcomes = courseData.outcomes?.length
          ? courseData.outcomes.map((outcome, index) => ({
              description: outcome.description || "",
              sequence: outcome.sequence || index + 1,
            }))
          : [{ description: "", sequence: 1 }];
        setOutcomes(fetchedOutcomes);
      } catch (err) {
        setError("Failed to fetch course data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInstructors();
    getCourse();
  }, [courseId, token]);



    try {
      if (courseId) {
        // Update existing course
        await axios.put(
          `http://localhost:8080/api/courses/${courseId}`,
          courseData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new course
        await axios.post("http://localhost:8080/api/courses", courseData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // Reset form after successful submission
      setCourse({
        title: "",
        instructorId: "",
        price: "",
        description: "",
        imageUrl: "",
      });
      setModules([{ title: "", sequence: 1, topics: [{ title: "", sequence: 1 }] }]);
      setOutcomes([{ description: "", sequence: 1 }]);
      setCourseFormVisible(false);
      navigate("/courses"); // Redirect to course list or desired route
    } catch (err) {
      setError("Failed to save course");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">
            {courseId ? "Edit Course" : "Add Course"}
          </h1>
          <p className="mt-2 opacity-80">
            {courseId ? "Update your course details" : "Create a new photography course"}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form
            onSubmit={handleCourseSubmit}
            className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {courseId ? "Update Course" : "New Course"}
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
                          setCourse({ ...course, instructorId: e.target.value })
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
                        setCourse({ ...course, description: e.target.value })
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
                            updateModule(moduleIndex, "title", e.target.value)
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
                          <div className="flex items-center mt-3 space-x-4">
                            <button
                              type="button"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                              onClick={() => addTopic(moduleIndex)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Topic
                            </button>
                            {module.topics.length > 1 && (
                              <button
                                type="button"
                                className="flex items-center text-red-600 hover:text-red-800"
                                onClick={() => removeTopic(moduleIndex)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove Topic
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                      onClick={addModule}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Module
                    </button>
                    {modules.length > 1 && (
                      <button
                        type="button"
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={removeModule}
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Remove Module
                      </button>
                    )}
                  </div>
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
                        onChange={(e) => updateOutcome(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      type="button"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={addOutcome}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Learning Outcome
                    </button>
                    {outcomes.length > 1 && (
                      <button
                        type="button"
                        className="flex items-center text-red-600 hover:text-red-800"
                        onClick={removeOutcome}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove Learning Outcome
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/admin/courses")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                {courseId ? "Update Course" : "Save Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}