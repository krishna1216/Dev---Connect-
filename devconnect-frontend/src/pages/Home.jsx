import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  // If already logged in → go to feed
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/feed");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5">
        <h1 className="text-2xl font-bold">DevConnect</h1>

        <div className="space-x-4">
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
            Login
          </Link>
          <Link to="/signup" className="border border-white px-4 py-2 rounded-lg font-semibold">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-32 px-4">
        <h2 className="text-5xl font-extrabold mb-6">
          Connect. Share. Grow.
        </h2>

        <p className="text-lg max-w-2xl mb-8 opacity-90">
          DevConnect is a social platform for developers where you can
          share posts, follow people, like & comment, and build your
          coding network.
        </p>

        <Link
          to="/signup"
          className="bg-white text-blue-600 px-8 py-3 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition"
        >
          Get Started 
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-40 px-10 pb-20 text-center">
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur">
          <h3 className="text-xl font-semibold mb-2">Create Posts</h3>
          <p>Share your projects, ideas and achievements.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur">
          <h3 className="text-xl font-semibold mb-2">Follow Developers</h3>
          <p>Build your personal coding network.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur">
          <h3 className="text-xl font-semibold mb-2">Engage</h3>
          <p>Like and comment on posts in real time.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
