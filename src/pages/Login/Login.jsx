import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

import "./login.css";
import { Link } from "react-router-dom";

export const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(apiUrl + "/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        setLoading(false);
        toast.success(response.data.message, {

          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setLoggedIn(true);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setLoading(false);
        toast.error(response.data.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error)
        if (error.response.status === 500) {
            setLoading(false);
            toast.error("Server not working. Please try again later.", {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        if (error.response.status === 400) {
          setLoading(false);
          // Handle 400 Bad Request error (e.g., invalid credentials)
          toast.error(error.response.data.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          setLoading(false);
          toast.error("An error occurred. Please try again.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else if (error.request) {
        setLoading(false);
        // Handle network error (e.g., server is down)
        toast.error("Server not working. Please try again later.", {
          position: "bottom-right",
          autoClose: false, // Persistent toast until dismissed
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setLoading(false);
        toast.error("An unexpected error occurred. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container">
        <h2 style={location.pathname === '/login' ? {} : {color: 'white'}}>Login</h2>
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
          <button type="submit" disabled={loading} className={loading ? "loading" : ""}>
            {loading ? <span className="loader"></span> : "Login"}
          </button>
          Don't have an account?
          <Link to="/register" className="register-btn">Register</Link>
        </form>
        <ToastContainer />
      </div>
  );
};
