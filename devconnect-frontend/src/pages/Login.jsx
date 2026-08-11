import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";  


function Login() {
  const navigate = useNavigate();
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) navigate("/feed");
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.access_token);   // pass separately
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("Login success:", data);
    navigate("/feed");

    
    

    alert("Login Successful 🚀");
  } catch (error) {
    console.error("Login failed:", error.response?.data);
    alert("Invalid credentials");
  }
  
};



  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-sm mt-4 text-center">
          Don’t have an account? 
          <a href="/signup" className="text-blue-600"> Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
