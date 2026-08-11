import API from "./axios";
import axios from "axios";
// GET FEED
export const getFeed = async (page, limit) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `http://localhost:8000/feed/?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// CREATE POST
export const createPost = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:8000/posts/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res.data;
};
export const getMyPosts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:8000/posts/my",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
export const toggleLike = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `http://localhost:8000/likes/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const unlikePost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `http://localhost:8000/likes/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const addComment = async (postId, content) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `http://localhost:8000/comments/${postId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const getComments = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `http://localhost:8000/comments/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `http://localhost:8000/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `http://localhost:8000/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};