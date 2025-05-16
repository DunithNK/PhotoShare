import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function InstructorDetails() {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  if (loading) {
    return <div className="text-center p-8">Loading instructor details...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (!instructor) {
    return <div className="text-center p-8">Instructor not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {instructor.profileImage && (
            <div className="md:w-1/3">
              <img 
                src={instructor.profileImage} 
                alt={`${instructor.name}'s profile`}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold mb-2">{instructor.name}</h1>
            <p className="text-gray-600 mb-4">{instructor.email}</p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Biography</h2>
              <p className="text-gray-700">{instructor.bio || "No biography available."}</p>
            </div>
            
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}