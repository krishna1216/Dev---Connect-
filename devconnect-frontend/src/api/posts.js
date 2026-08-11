import API from "./axios";

// GET FEED
export const getFeed = async (page, limit) => {
  const response = await API.get(`/feed/?page=${page}&limit=${limit}`);
  return response.data;
};


// CREATE POST
export const createPost = async (formData) => {
  const res = await API.post("/posts/", formData);
  return res.data;
};
export const getMyPosts = async () => {
  const response = await API.get("/posts/my");

  return response.data;
};
export const toggleLike = async (postId) => {
  const response = await API.post(`/likes/${postId}`, {});
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await API.delete(`/likes/${postId}`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await API.post(`/comments/${postId}`, { content });
  return response.data;
};

export const getComments = async (postId) => {
  const response = await API.get(`/comments/${postId}`);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await API.delete(`/posts/${postId}`);
  return response.data;
};