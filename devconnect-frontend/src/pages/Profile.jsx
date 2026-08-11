import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserPosts, getUserProfile, followUser, unfollowUser } from "../api/users";
import PostCard from "../components/PostCard";

function Profile() {
  const params = useParams();
  const userId = params.userId || params.id;

  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState(false);

  const handlePostUpdate = (postId, updates) => {
    if (updates.deleted) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    } else {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
    }
  };

  useEffect(() => {
    let ignore = false; // 🔒 prevents strict-mode double call

    const loadProfile = async () => {
      try {
        const profileData = await getUserProfile(userId);
        const postsData = await getUserPosts(userId);

        if (!ignore) {
          setProfile(profileData);
          setPosts(postsData);
          setFollowing(profileData.is_following || false);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      }
    };

    loadProfile();

    return () => {
      ignore = true; // cleanup
    };
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
      } else {
        await followUser(userId);
        setFollowing(true);
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const isCurrentUser = currentUser.id === Number(userId)

  return (
    <div className="max-w-3xl mx-auto mt-8">

      {/* PROFILE HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex items-center gap-5">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.email}</h2>
          <p className="text-gray-500">User ID: {profile.id}</p>
          <p className="text-gray-500">Posts: {posts.length}</p>
          <p className="text-gray-500">Followers: {profile.followers_count || 0}</p>
          <p className="text-gray-500">Following: {profile.following_count || 0}</p>

          {!isCurrentUser && (
            <button
              onClick={handleFollow}
              className={`mt-3 px-5 py-2 rounded-lg text-white ${
                following ? "bg-gray-600" : "bg-blue-600"
              }`}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          )}

          {isCurrentUser && (
            <div className="mt-3 px-5 py-2 rounded-lg bg-gray-100 text-gray-700">
              This is your profile
            </div>
          )}
        </div>
      </div>

      {/* POSTS */}
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

export default Profile;
