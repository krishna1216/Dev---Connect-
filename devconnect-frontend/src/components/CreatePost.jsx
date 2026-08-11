import { useState } from "react";
import { createPost } from "../api/posts";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (file) {
        formData.append("file", file);
      }

      const newPost = await createPost(formData);

      onPostCreated(newPost);
      setContent("");
      setFile(null);

    } catch (err) {
      console.error("Post error:", err.response?.data);
      alert("Post failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow mb-6"
    >
      <textarea
        placeholder="What's on your mind?"
        className="w-full border p-3 rounded-lg mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
