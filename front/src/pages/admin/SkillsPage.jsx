import { Eye, Edit, Trash, Plus } from "lucide-react";
import { users } from "../../data/data";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function SkillsPage() {
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isViewPost = location.pathname.includes("/view-post");

  

  if (isViewPost) {
    return <Outlet />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">All Posts</h3>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.postid}>
                <td className="px-6 py-4 whitespace-nowrap">{post.postid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(`/admin/skills/view-post/${post.postid}`, {
                          state: { postId: post.postid, link: post.postlink },
                        })
                      }
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(post.postid)}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}