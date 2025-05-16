import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User, Edit2, Trash2, Save, X } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    userName: "",
    email: "",
    role: "",
    createdAt: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    userName: "",
    email: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const email = decoded.sub;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setEditedData({
          userName: response.data.userName,
          email: response.data.email
        });
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      userName: userData.userName,
      email: userData.email
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/users/${userData.id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUserData(response.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/users/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.removeItem("token");
        navigate("/home");
      } catch (err) {
        setError("Failed to delete account");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">User Profile</h2>
            <div className="flex space-x-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={20} />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                    <span>Delete Account</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-800"
                  >
                    <Save size={20} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <User size={24} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-lg font-medium">{userData.id}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.userName}
                  onChange={(e) => setEditedData({ ...editedData, userName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg">{userData.userName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg">{userData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-lg capitalize">{userData.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-lg">
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;