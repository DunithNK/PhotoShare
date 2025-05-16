import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MoreHorizontal,
  User,
  Bell,
  X,
  CloudUpload,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { IMAGES } from "../../assets/images";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../../service/supabaseClient";
import axios from "axios";

const SkillSharePage = () => {
  const [favorites, setFavorites] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comments, setComments] = useState({}); // Stores comments keyed by postId
  const [newComments, setNewComments] = useState({}); // Input text for new comments, keyed by postId
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [imageUrl, setImageUrl] = useState(""); // imageUrl state seems unused after upload logic
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");
  const decode = token ? jwtDecode(token) : { userId: null }; // Ensure 'userId' matches the field in your JWT
  const userId = decode.userId; // This should be the current logged-in user's ID
  const [recentPosts, setRecentPosts] = useState([]);

  const categories = [
    {
      id: "c1",
      name: "City and Architecture",
      src: IMAGES.architecture,
      route: "city",
    },
    {
      id: "c2",
      name: "Landscapes",
      src: IMAGES.landscape,
      route: "landscapes",
    },
    { id: "c3", name: "Nature", src: IMAGES.butifulpath, route: "nature" },
    { id: "c4", name: "Animal", src: IMAGES.zebra, route: "animal" },
    { id: "c5", name: "People", src: IMAGES.birthday, route: "people" },
    { id: "c6", name: "Macro", src: IMAGES.macro, route: "macro" },
  ];


  const uploadCategories = [
    "City and Architecture",
    "Landscapes",
    "Nature",
    "Animal",
    "People",
    "Macro",
  ];

  const toggleFavorite = (photoId) => {
    setFavorites((prev) => ({ ...prev, [photoId]: !prev[photoId] }));
    setLikeCounts((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + (favorites[photoId] ? -1 : 1),
    }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      return;
    }
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage
        .from("photoshare")
        .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });
      if (error) {
        console.error("Upload error:", error);
        alert("Error uploading image. Please try again.");
        setIsUploading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("photoshare")
        .getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;
      setImageUrl(publicUrl); // Set state, though it's passed directly to handlePostSave
      await handlePostSave(publicUrl);
      setImageFile(null);
      setCategory("");
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error("Upload process failed:", err);
      alert("Upload process failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePostSave = async (uploadedImageUrl) => {
    if (!userId) {
      alert("User not identified for posting. Please log in again.");
      return false;
    }
    const postUploadData = {
      userid: userId,
      postlink: uploadedImageUrl,
      category: category,
    };
    console.log("Saving post with data:", postUploadData);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/posts",
        postUploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Post saved successfully");
        // Refresh recent posts or add to list
        handleGetRecentPosts(); // Refresh posts after new upload
        return true;
      } else {
        console.error("Unexpected response:", response);
        return false;
      }
    } catch (err) {
      console.error("Error saving post:", err.response?.data || err.message);
      alert(`Error saving post: ${err.response?.data?.message || err.message}`);
      return false;
    }
  };

  const handleGetRecentPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/posts/recent",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecentPosts(response.data);
      console.log("Recent posts fetched:", response.data);
    } catch (err) {
      console.error(
        "Error fetching recent posts:",
        err.response?.data || err.message
      );
      setRecentPosts([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (token) {
      // Only fetch if token exists
      handleGetRecentPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-fetch if token changes (e.g., on login)

  // Fetch comments when a photo is selected
  useEffect(() => {
    const fetchCommentsForPhoto = async () => {
      if (selectedPhoto && selectedPhoto.postid && token) {
        try {
          // Initialize comments for the post to an empty array before fetching
          setComments((prev) => ({ ...prev, [selectedPhoto.postid]: [] }));
          const response = await axios.get(
            `http://localhost:8080/api/comments/post/${selectedPhoto.postid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedComments = response.data.map((c) => ({
            id: c.commentid, // Use commentid as the unique ID
            text: c.comment,
            userid: c.userid, // Store userid to know who made the comment
            username: c.username,
            createdAt: c.createdAt,
            postid: c.postid,
          }));
          setComments((prev) => ({
            ...prev,
            [selectedPhoto.postid]: fetchedComments,
          }));
        } catch (err) {
          console.error(
            "Error fetching comments:",
            err.response?.data || err.message
          );
          // Keep comments as empty array or handle error display
          setComments((prev) => ({ ...prev, [selectedPhoto.postid]: [] }));
        }
      }
    };
    fetchCommentsForPhoto();
  }, [selectedPhoto, token]);

  const handleNewCommentChange = (photoId, value) => {
    setNewComments((prev) => ({ ...prev, [photoId]: value }));
  };

  const addComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) {
      alert("Comment cannot be empty.");
      return;
    }
    if (!userId) {
      alert("User not identified. Please log in again.");
      return;
    }

    const commentData = {
      postid: postId,
      userid: userId,
      comment: commentText,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/comments",
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const newCommentFromApi = response.data;
        const formattedComment = {
          id: newCommentFromApi.commentid,
          text: newCommentFromApi.comment,
          userid: newCommentFromApi.userid,
          createdAt: newCommentFromApi.createdAt,
          postid: newCommentFromApi.postid,
        };
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), formattedComment],
        }));
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
        console.log("Comment added successfully:", newCommentFromApi);
      } else {
        console.error(
          "Error adding comment - Unexpected response status:",
          response.status,
          response.data
        );
        alert(`Failed to add comment. Status: ${response.status}`);
      }
    } catch (err) {
      console.error(
        "Error adding comment:",
        err.response ? err.response.data : err.message
      );
      alert(
        `Failed to add comment: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        // No Content for successful deletion
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((c) => c.id !== commentId),
        }));
        console.log("Comment deleted successfully");
      } else {
        console.error(
          "Error deleting comment - Unexpected response status:",
          response.status
        );
        alert("Failed to delete comment.");
      }
    } catch (err) {
      console.error(
        "Error deleting comment:",
        err.response ? err.response.data : err.message
      );
      alert(
        `Failed to delete comment: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const confirmEditComment = async (postId) => {
    if (!editingCommentId || !editedCommentText.trim()) {
      alert("Comment text cannot be empty for an update.");
      return;
    }
    const commentData = { comment: editedCommentText.trim() }; // DTO expects only the comment text for update
    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/${editingCommentId}`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const updatedCommentFromApi = response.data;
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].map((c) =>
            c.id === editingCommentId
              ? {
                  ...c,
                  text: updatedCommentFromApi.comment,
                  userid: updatedCommentFromApi.userid,
                  createdAt: updatedCommentFromApi.createdAt,
                }
              : c
          ),
        }));
        setEditingCommentId(null);
        setEditedCommentText("");
        console.log("Comment updated successfully");
      } else {
        console.error(
          "Error updating comment - Unexpected response status:",
          response.status
        );
        alert("Failed to update comment.");
      }
    } catch (err) {
      console.error(
        "Error updating comment:",
        err.response ? err.response.data : err.message
      );
      alert(
        `Failed to update comment: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setIsUploadModalOpen(false);
        setSelectedPhotographer(null);
        setEditingCommentId(null); // Also close editing mode on escape
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const cardHover = {
    rest: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const PhotoCard = ({ post }) => (
    <motion.div
      className="overflow-hidden rounded-lg relative cursor-pointer"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={() => setSelectedPhoto(post)}
      tabIndex={0}
      role="button"
      aria-label={`View details for photo ${post.postid}`}
    >
      <img
        src={post.postlink}
        alt={post.alt || `Photo ID ${post.postid}`}
        className="h-44 w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
        <button
          className={`rounded-full p-1 bg-white bg-opacity-80 ${
            favorites[post.postid] ? "text-red-500" : "text-gray-700"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(post.postid);
          }}
          aria-label="Toggle like"
        >
          <Heart
            size={18}
            fill={favorites[post.postid] ? "currentColor" : "none"}
          />
        </button>
        <button
          className="rounded-full p-1 bg-white bg-opacity-80 text-gray-700"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </motion.div>
  );

  const PhotographerModal = ({ photographer }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setSelectedPhotographer(null)}
          aria-label="Close photographer modal"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <img
            src={photographer.profileImage}
            alt={photographer.name}
            className="h-24 w-24 object-cover rounded-full"
          />
          <div>
            <h2 className="text-2xl font-semibold">{photographer.name}</h2>
            <p className="text-gray-600">{photographer.specialty}</p>
            <p className="text-gray-500">
              {photographer.occupation} | {photographer.age} years old
            </p>
            <p className="text-gray-500">{photographer.followers} Followers</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">Photographer's Feed</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photographer.feed.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Photographer's feed ${index + 1}`}
              className="h-40 w-full object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );

  const UploadModal = () => {
    const fileInputRef = useRef(null);
    const handleFileSelect = () => fileInputRef.current.click();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          className="bg-white w-full max-w-md p-6 rounded-lg relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={() => {
              setIsUploadModalOpen(false);
              setImageFile(null);
              setIsUploading(false);
            }}
            aria-label="Close upload modal"
            disabled={isUploading}
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">Upload Photo</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
              ref={fileInputRef}
              disabled={isUploading}
            />
            {imageFile ? (
              <div className="mt-1 flex items-center space-x-2 p-2 border rounded bg-gray-50">
                <ImageIcon size={24} className="text-blue-500" />
                <span className="text-sm text-gray-600 truncate">
                  {imageFile.name}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleFileSelect}
                className="mt-1 block w-full border rounded p-2 text-gray-700 hover:bg-gray-100 text-left"
                aria-label="Choose image file"
                disabled={isUploading}
              >
                Choose Image
              </button>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              disabled={isUploading}
            >
              <option value="">Select a category</option>
              {uploadCategories.map((cat) => (
                <option
                  key={cat}
                  value={cat.toLowerCase().replace(/ & /g, "and")}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleImageUpload}
            className={`w-full text-white px-4 py-2 rounded flex items-center justify-center space-x-2 ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CloudUpload size={20} />
                <span>Upload</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full bg-black text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-lg font-semibold">Skills Sharing and Photo Feed</h1>
        <div className="flex items-center space-x-4">
          <User
            size={20}
            className="cursor-pointer"
            aria-label="User profile"
          />
          <Bell
            size={20}
            className="cursor-pointer"
            aria-label="Notifications"
          />
          {token && ( // Show upload button only if logged in
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-500 text-white px-3 py-1 sm:px-4 rounded-full flex items-center space-x-2 hover:bg-blue-600"
            >
              <CloudUpload size={20} />
              <span className="hidden sm:inline">Upload</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 py-6">
        {/* Recent Photos Section */}
        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-2">Recent Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <PhotoCard key={post.postid} post={post} />
              ))
            ) : (
              <p>No recent posts to display.</p>
            )}
          </div>
        </motion.section>

        {/* Popular Photos Section - Assuming same data source for now */}
        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-2">Popular Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentPosts.slice(0, 6).map((post) => (
              <PhotoCard key={post.postid} post={post} />
            ))}
            {recentPosts.length === 0 && <p>No popular posts to display.</p>}
          </div>
        </motion.section>

        {/* My Photos Section - Needs specific API endpoint & logic */}
        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-2">My Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Example: Filter recentPosts or fetch specific user posts */}
            {recentPosts.filter((p) => p.userid === userId).length > 0 ? (
              recentPosts
                .filter((p) => p.userid === userId)
                .map((post) => <PhotoCard key={post.postid} post={post} />)
            ) : (
              <p>
                You have not uploaded any photos yet, or there was an issue
                fetching them.
              </p>
            )}
          </div>
        </motion.section>

        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link to={`/category/${cat.route}`} key={cat.id}>
                <div className="relative rounded overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={cat.src}
                    alt={cat.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-semibold text-lg hover:bg-opacity-50 transition-opacity">
                    {cat.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </main>

      {isUploadModalOpen && <UploadModal />}
      {selectedPhotographer && (
        <PhotographerModal photographer={selectedPhotographer} />
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => {
                setSelectedPhoto(null);
                setEditingCommentId(null);
              }}
              aria-label="Close photo detail modal"
            >
              <X size={24} />
            </button>
            <img
              src={selectedPhoto.postlink}
              alt={`Photo by user ${selectedPhoto.userid}`}
              className="w-full h-auto max-h-[60vh] object-contain mb-4 rounded"
            />
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Heart
                  size={20}
                  className={
                    favorites[selectedPhoto.postid]
                      ? "text-red-500"
                      : "text-gray-700"
                  }
                />
                <span>{likeCounts[selectedPhoto.postid] || 0} Likes</span>
              </div>
              {/* <p className="text-sm text-gray-500">Category: {selectedPhoto.category}</p> */}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {(comments[selectedPhoto.postid] || []).length > 0 ? (
                  (comments[selectedPhoto.postid] || []).map((c) => (
                    <div
                      key={c.id}
                      className="p-2 rounded bg-gray-50 border border-gray-200"
                    >
                      {editingCommentId === c.id ? (
                        <>
                          <textarea
                            value={editedCommentText}
                            onChange={(e) =>
                              setEditedCommentText(e.target.value)
                            }
                            className="border p-2 rounded w-full text-sm"
                            rows="2"
                          />
                          <div className="flex space-x-2 mt-1">
                            <button
                              onClick={() =>
                                confirmEditComment(selectedPhoto.postid)
                              }
                              className="text-green-600 text-xs font-semibold hover:text-green-800"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="text-gray-500 text-xs font-semibold hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-800">{c.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">
                              {c.username} -{" "}
                              {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                            {userId === c.userid && ( // Show Edit/Delete only if current user is the comment author
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => startEditingComment(c)}
                                  className="text-blue-600 text-xs font-semibold hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    deleteComment(selectedPhoto.postid, c.id)
                                  }
                                  className="text-red-600 text-xs font-semibold hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
              {token && ( // Show comment input only if logged in
                <div className="mt-4">
                  <textarea
                    value={newComments[selectedPhoto.postid] || ""}
                    onChange={(e) =>
                      handleNewCommentChange(
                        selectedPhoto.postid,
                        e.target.value
                      )
                    }
                    placeholder="Add a comment..."
                    className="w-full border px-2 py-1.5 rounded text-sm"
                    rows="2"
                  />
                  <button
                    onClick={() => addComment(selectedPhoto.postid)}
                    className="mt-2 bg-blue-500 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600"
                  >
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SkillSharePage;
