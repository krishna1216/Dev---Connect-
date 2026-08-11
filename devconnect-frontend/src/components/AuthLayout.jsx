const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      
      {/* Left Branding Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">DevConnect 🚀</h1>
          <p className="text-lg opacity-90">
            Connect. Build. Grow with Developers worldwide.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
