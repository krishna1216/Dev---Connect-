import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import MyProfile from "../pages/MyProfile";

import ProtectedRoute from "./ProtectedRoute";


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register/>} />

        {/* Private pages */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
