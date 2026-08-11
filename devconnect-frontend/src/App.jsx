import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import MyProfile from "./pages/MyProfile";
import Profile from "./pages/Profile";


// 👇 This component decides when Navbar should show
function Layout() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // hide navbar on home/login/signup
  const hideNavbarRoutes = ["/", "/login", "/signup"];
  const showNavbar = token && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Private pages */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
       
        <Route path="/my-profile" element={<MyProfile />} />

      </Routes>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
