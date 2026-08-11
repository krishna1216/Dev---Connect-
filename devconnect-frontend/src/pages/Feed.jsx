import { useEffect, useState } from "react";
import { getFeed } from "../api/posts";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

function Feed() {
  const handleNewPost = (post) => {
    setPosts(prev => [post, ...prev]); // add on top instantly
  };

  const handlePostUpdate = (postId, updates) => {
    if (updates.deleted) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    } else {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
    }
  };

  // STATE
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // LOAD POSTS WHEN PAGE CHANGES
  useEffect(() => {
    loadPosts();
  }, [page]);

  // FUNCTION
 const loadPosts = async () => {
  try {
    setLoading(true);
    const data = await getFeed(page, 5);

    console.log("FEED RESPONSE:", data);

    // Handle multiple possible backend formats
    let postsArray = [];

    if (Array.isArray(data)) {
      postsArray = data;
    } else if (data.posts) {
      postsArray = data.posts;
    } else if (data.items) {
      postsArray = data.items;
    }

    setPosts(prev => [...prev, ...postsArray]);

  } catch (err) {
    console.error("Feed error:", err);
  } finally {
    setLoading(false);
  }
};

 return (
  <div className="min-h-screen bg-gray-100 py-6">
    <div className="max-w-2xl mx-auto space-y-6">

      {/* CREATE POST BOX */}
      <CreatePost onPostCreated={handleNewPost} />

      {/* POSTS */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPostUpdate={handlePostUpdate}
        />
      ))}

      {/* LOAD MORE */}
      <div className="text-center">
        <button
          onClick={() => setPage(prev => prev + 1)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>

    </div>
  </div>
);
}

export default Feed;