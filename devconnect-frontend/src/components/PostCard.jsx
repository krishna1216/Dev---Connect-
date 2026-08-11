import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike, unlikePost, addComment, getComments, deleteComment, deletePost } from "../api/posts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getMediaSrc = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}/${url}`;
};

function PostCard({ post, onPostUpdate }) {
  const [isLiked, setIsLiked] = useState(post.is_liked_by_me || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLike = async () => {
    try {
      setLoading(true);
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await toggleLike(post.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      try {
        const data = await getComments(post.id);
        setComments(data);
      } catch (err) {
        console.error("Comments error:", err);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await addComment(post.id, newComment);
      setComments(prev => [...prev, comment]);
      setNewComment("");
      // Update comment count in parent if needed
      if (onPostUpdate) {
        onPostUpdate(post.id, { comments_count: (post.comments_count || 0) + 1 });
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      if (onPostUpdate) {
        onPostUpdate(post.id, { comments_count: (post.comments_count || 0) - 1 });
      }
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        // Notify parent to remove the post from the feed
        if (onPostUpdate) {
          onPostUpdate(post.id, { deleted: true });
        }
      } catch (err) {
        console.error("Delete post error:", err);
        alert("Failed to delete post");
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      {/* USER */}
      <div className="flex items-center gap-3 mb-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <Link to={`/profile/${post.user_id}`} className="font-semibold hover:underline">
              User #{post.user_id}
            </Link>
            <p className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {post.user_id === currentUser.id && (
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm font-semibold"
          >
            🗑️ Delete
          </button>
        )}
      </div>

      {/* CONTENT */}
      {post.content && (
        <p className="mb-3 text-gray-800">{post.content}</p>
      )}

      {/* MEDIA */}
      {post.image_url && (
        <img
          src={getMediaSrc(post.image_url)}
          alt="post"
          className="rounded-xl mb-3 w-full"
        />
      )}

      {post.video_url && (
        <video controls className="rounded-xl mb-3 w-full">
          <source src={getMediaSrc(post.video_url)} />
        </video>
      )}

      {/* ACTION BAR */}
      <div className="flex gap-6 text-gray-600 text-sm border-t pt-3">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
        >
          ❤️ {likesCount} {isLiked ? 'Liked' : 'Like'}
        </button>
        <button
          onClick={handleShowComments}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          💬 {post.comments_count || 0} Comments
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="mt-4 border-t pt-4">
          {/* ADD COMMENT */}
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Post
              </button>
            </div>
          </form>

          {/* COMMENTS LIST */}
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-sm font-semibold">User #{comment.user_id}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                    {comment.user_id === currentUser.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;