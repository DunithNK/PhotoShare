import React from "react";

const FilterBar = ({ sortOption, setSortOption }) => {
  return (
    <div className="mb-4 flex items-center space-x-4">
      <label className="text-sm font-medium">Sort by:</label>
      <select
        className="border px-2 py-1 rounded"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default FilterBar;
