import { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

import "./login.css";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl + "auth/login", {
        email,
        password,
      });
      if (response.data.success) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error.data.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        
      </form>
    </div>
  );
};
