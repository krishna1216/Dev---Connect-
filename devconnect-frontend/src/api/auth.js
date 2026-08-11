import api from "./axios";

// SIGNUP (JSON → normal body)
export const signupUser = async (email, password) => {
  const res = await api.post("/users/signup", {
    email,
    password,
  });
  return res.data;
};


// LOGIN (FORM DATA → OAuth2PasswordRequestForm required)
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);   // VERY IMPORTANT
  formData.append("password", password);

  const res = await api.post("/users/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // save token
  localStorage.setItem("token", res.data.access_token);
  // save user data
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};
