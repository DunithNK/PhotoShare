import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skillSharingImg from '../../assets/medium-shot-photographer-groom.jpg';
import Hero from '../../assets/sail-boat.jpg'
import CourseImg from '../../assets/masterphotography.jpg'
import Workshop from '../../assets/Workshop.jpg'
import CommunityMeeting from '../../assets/community-meeting.jpg'
import  Exebition from '../../assets/exebition.jpg'
import Wildphotography from '../../assets/wild-photography.jpg'

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const events = [Workshop,CommunityMeeting,Exebition,Wildphotography]
  console.log(token)
 
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Hover animation for cards
  const cardHover = {
    rest: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      {!token && (
        <header className="w-full bg-black text-white p-4 flex justify-end">
          <>
            <button className="mr-4 hover:text-gray-300 transition-colors" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="hover:text-gray-300 transition-colors" onClick={() => navigate("/register")}>
              SignUp
            </button>
          </>
        </header>
      )}

      {/* Hero Section */}
      <motion.section
        className="relative w-full max-w-6xl mx-auto my-4 overflow-hidden rounded-2xl"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div
          className="relative h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${Hero})`,
            filter: "brightness(0.8)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              The World's Best Photography Is Here
            </h1>
            <p className="text-sm max-w-md">
              Join a global community of photographers sharing over 200 million
              incredible images and showcasing their best work.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Skill Sharing Section */}
      <motion.section
        className="w-full max-w-6xl mx-auto my-8 px-4 flex flex-col md:flex-row items-center gap-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full md:w-1/2">
          <motion.img
            src={skillSharingImg}
            alt="Skill Sharing"
            className="w-full rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Skill Sharing & Content Management Made Simple
          </h2>
          <p className="mb-4">
            Empower your journey with seamless skill sharing and smart content
            management. Connect, collaborate, and showcase your expertise
            effortlessly.
          </p>
          <motion.button
            className="bg-black text-white px-6 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/skill-share")}
          >
            View more
          </motion.button>
        </div>
      </motion.section>

      {/* Course Management Section */}
      <motion.section
        className="w-full max-w-6xl mx-auto my-8 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          Course Management & Administration Made Easy
        </h2>
        <p className="mb-8">
          Effortlessly create, organize, and manage courses with powerful tools.
          Share knowledge, engage learners, and grow your impact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item,index) => (
            <motion.button
              key={item}
              className="bg-gray-100 rounded-lg overflow-hidden relative"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              onClick={() => navigate(`/course-details/${item}`)}
            >
              <img
                src={CourseImg}
                alt="Course"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-sm text-left">
                  Mastering Photography: From Basics to Pro
                </h3>
                <div className="flex items-center text-sm mt-2">
                  <span className="mr-2">5.0 ★★★★★</span>
                  <span className="text-gray-500">(120)</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="font-bold text-sm">$24.99</span>
                    <span className="line-through text-gray-500 text-sm ml-2">
                      $79.99
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            className="bg-black text-white px-6 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/course-management")}
          >
            View more
          </motion.button>
        </div>
      </motion.section>

      {/* Event Management Section */}
      <motion.section
        className="w-full max-w-6xl mx-auto my-8 px-4 mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          Event Management & Administration Made Easy
        </h2>
        <p className="mb-8">
          Easily plan, coordinate, and oversee events with user-friendly tools.
          Promote, engage, and connect with your audience effortlessly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((item,index) => (
            <motion.div
              key={item}
              className="bg-gray-100 rounded-lg overflow-hidden relative"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
            >
              <img
                src={events[index]}
                alt="Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-sm">What is Lorem Ipsum?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>
                <div className="flex justify-end mt-2">
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            className="bg-black text-white px-6 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>navigate("/event-management")}
          >
            View more
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;