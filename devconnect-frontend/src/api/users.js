import api from "./axios";
import axios from "axios";

// get user posts
export const getUserPosts = async (userId) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};

// follow user
export const followUser = async (userId) => {
  const res = await api.post(`/follows/${userId}`);
  return res.data;
};

// unfollow user
export const unfollowUser = async (userId) => {
  const res = await api.delete(`/follows/${userId}`);
  return res.data;
};


export const getUserProfile = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};
export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};



export const getMyPosts = async () => {
  const res = await api.get("/posts/my");
  return res.data;
};

export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
  return res.data;
};