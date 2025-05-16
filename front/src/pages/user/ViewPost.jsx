import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Clock, User, MessageCircle } from "lucide-react";

export default function ViewPost() {
  const location = useLocation();
  const { postId, link } = location.state;
  const token = localStorage.getItem("token");
  const [comments, setComments] = useState([]);

  

  // Format the date to be more human-readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Post image */}
      <div className="flex justify-center bg-gray-100 p-4">
        <img
          src={link}
          alt="Post"
          className="rounded-lg object-cover max-h-96 w-auto"
        />
      </div>

      {/* Comments section */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MessageCircle className="mr-2" size={20} />
          Comments
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.commentid}
                className="border-b border-gray-200 pb-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{comment.comment}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={16} className="mr-1" />
                      <span className="font-medium mr-4">
                        {comment.username}
                      </span>
                      <Clock size={16} className="mr-1" />
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.commentid)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
