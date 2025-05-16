// src/pages/user/PhotoCategoryPage.jsx

import React, { useState, useEffect } from "react";

const PhotoCategoryPage = ({ category }) => {
  const [photos, setPhotos] = useState([]);
  const [filters, setFilters] = useState({ date: "", uploadTime: "" });

  // Fetching images based on the category
  useEffect(() => {
    // You would replace this with an actual API call to get photos based on category
    fetch(`/api/photos/${category}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Error fetching photos:", err));
  }, [category]);

  // Handle like functionality
  const handleLike = (photoId) => {
    console.log("Liked photo:", photoId);
    // Implement like functionality here (e.g., API call)
  };

  // Handle comment functionality
  const handleComment = (photoId, comment) => {
    console.log("Commented on photo:", photoId, comment);
    // Implement comment functionality here (e.g., API call)
  };

  // Handle filtering
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Photos</h1>
      
      {/* Filters for date and upload time */}
      <div>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          type="time"
          name="uploadTime"
          value={filters.uploadTime}
          onChange={handleFilterChange}
        />
      </div>

      {/* Displaying the photos */}
      <div>
        {photos
          .filter((photo) => {
            // Apply the filter logic here
            if (filters.date && photo.uploadDate !== filters.date) return false;
            if (filters.uploadTime && photo.uploadTime !== filters.uploadTime)
              return false;
            return true;
          })
          .map((photo) => (
            <div key={photo.id}>
              <img src={photo.url} alt={photo.title} />
              <div>
                <button onClick={() => handleLike(photo.id)}>Like</button>
                <button onClick={() => handleComment(photo.id, "Great photo!")}>
                  Comment
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PhotoCategoryPage;
