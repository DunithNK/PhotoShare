import React from "react";
import CategoryPage from "../../components/CategoryPage"; // if CategoryPage.jsx is in /components
const images = [
  {
    id: "img1",
    src: "/uploads/architecture1.jpg",
    alt: "Modern building",
    uploadedAt: "2025-04-25T10:00:00Z",
  },
  {
    id: "img2",
    src: "/uploads/architecture2.jpg",
    alt: "Urban skyline",
    uploadedAt: "2025-03-15T09:30:00Z",
  },
];

const CityArchitecturePage = () => {
  return <CategoryPage title="City and Architecture" images={images} />;
};

export default CityArchitecturePage;
