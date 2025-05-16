import React from 'react';
import CategoryPage from "../../components/CategoryPage"; // if CategoryPage.jsx is in /components
const PhotoCategoryPage = ({ category }) => {
  const categoryMap = {
    city: 'City & Architecture',
    landscapes: 'Landscapes',
    nature: 'Nature',
    animal: 'Animal',
    people: 'People',
    macro: 'Macro'
  };

  return (
    <CategoryPage 
      title={categoryMap[category] || 'Category'} 
      categoryId={category}
    />
  );
};

export default PhotoCategoryPage; 