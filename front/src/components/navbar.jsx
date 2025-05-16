import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  return (
    <nav className="bg-gradient-to-r from-teal-500 to-cyan-600 p-5 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center text-white">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
          PhotoShare
        </h1>
        <ul className="flex space-x-6">
          {role === "user" && (
            <>
              <li>
                <Link
                  to="/home"
                  className="text-lg font-medium hover:text-pink-300 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/profile"
              className="text-lg font-medium hover:text-pink-300 transition-colors duration-300"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;