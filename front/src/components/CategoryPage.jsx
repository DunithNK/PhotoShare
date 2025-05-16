import React, { useState, useEffect } from "react";
import { Heart, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import FilterBar from "../components/FilterBar";

const CategoryPage = ({ title, images }) => {
  const [filteredImages, setFilteredImages] = useState(images);
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    let sorted = [...images];
    if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
    }
    setFilteredImages(sorted);
  }, [sortOption, images]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <FilterBar sortOption={sortOption} setSortOption={setSortOption} />

      <div className="grid grid-cols-3 gap-4">
        {filteredImages.map((img) => (
          <motion.div
            key={img.id}
            className="relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-60 object-cover"
            />
            <div className="absolute bottom-2 left-2 flex space-x-2 bg-white bg-opacity-80 px-2 py-1 rounded-full">
              <button onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(img.id);
              }}>
                <Heart
                  size={18}
                  className={favorites[img.id] ? "text-red-500" : "text-gray-600"}
                  fill={favorites[img.id] ? "currentColor" : "none"}
                />
              </button>
              <MoreHorizontal size={18} />
            </div>
          </motion.div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default CategoryPage;
