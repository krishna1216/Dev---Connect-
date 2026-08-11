import { useEffect, useState } from "react";
import { getMyPosts } from "../api/users";
import PostCard from "../components/PostCard";

function MyProfile() {
  const [posts, setPosts] = useState([]);

  const handlePostUpdate = (postId, updates) => {
    if (updates.deleted) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    } else {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
    }
  };

  useEffect(() => {
    let ignore = false; // 👈 prevents double execution
    
    const loadMyProfile = async () => {
      try {
        const data = await getMyPosts();
        console.log("MY POSTS RESPONSE:", data);
        if (!ignore) setPosts(data);
      } catch (err) {
        console.error("Profile error:", err);
      }
    };

    loadMyProfile();

    return () => {
      ignore = true; // cleanup for strict mode
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <p className="text-gray-500">Posts: {posts.length}</p>
      </div>

      <div className="space-y-5">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdate={handlePostUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default MyProfile;
