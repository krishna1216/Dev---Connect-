import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchUsers } from "../api/users";

function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    setSearchQuery(query);

    if (trimmed.length > 2) {
      try {
        const results = await searchUsers(trimmed);
        setSearchResults(results);
        setShowResults(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setShowResults(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center relative">
      
      <Link to="/" className="text-2xl font-bold text-blue-600">
        DevConnect
      </Link>

      <div className="flex items-center gap-6">
        {token && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowResults(searchQuery.length > 2)}
              autoComplete="off"
              className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent caret-black"
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {user.email}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Link to="/feed" className="hover:text-blue-600">
          Feed
        </Link>

        {token && (
          <Link to="/my-profile">
            Profile
          </Link>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;