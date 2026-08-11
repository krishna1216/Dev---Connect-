import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signupUser } from "../api/auth"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      await signupUser(email, password)

      alert("Account created! Please login.")
      navigate("/login")
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
          <p className="text-sm mt-4 text-center">
          Already have an account?
          <a href="/login" className="text-blue-600 ml-1">Login</a>
        </p>
      </form>
    </div>
  )
}
