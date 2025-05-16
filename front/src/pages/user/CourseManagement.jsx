import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CourseImg from '../../assets/course.jpg'

const CourseManagementPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    const getCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        });
        console.log(token);
        console.log(response.data[0]);
        setCourses(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCourses();
  }, []);

  

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Staggered animation for course cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className="fill-current text-yellow-500"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          size={16}
          className="fill-current text-yellow-500"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Course Management & Administration Made Easy
        </motion.h1>

        {/* Hero Banner */}
        <motion.div
          className="relative w-full rounded-lg overflow-hidden mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <img
            src={CourseImg}
            alt="Camera filming graffiti"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <h2 className="text-white text-3xl font-bold px-8">
              Keep moving up
            </h2>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Learners are viewing</h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses.map((course) => (
              <motion.button
                key={course.courseId}
                className="border rounded-xl overflow-hidden flex flex-col p-4 space-y-2"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/course-details/${course.courseId}`)}
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-56 object-cover"
                />
                <h3 className="font-bold text-lg">{course.title}</h3>
                <div className="flex items-center justify-center space-x-1">
                  <span>{course.rating}</span>
                  {renderStarRating(course.rating)}
                </div>
                <p className="font-bold text-lg">${course.price.toFixed(2)}</p>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseManagementPage;
