import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./assets/logo.png";
import "./App.css";

// import pages
import { Navbar } from "./components/Navbar/Navbar.jsx";
import { Home } from "./pages/Home/Home.jsx";
import { Contact } from "./pages/Contact/Contact.jsx";
import { Login } from "./pages/Login/Login.jsx";
import { Events } from "./pages/Events/Events.jsx";
import { Register } from "./pages/Register/Register.jsx";
import {ToastContainer} from "react-toastify";
import {MyErrorBoundary} from "./components/MyErrorBoundary/MyErrorBoundary.jsx";


export const App = () => {

  return (

      <MyErrorBoundary>
          <div className="app">
              <Router>
                  <Navbar logo={logo}/>
                  <Routes>
                      <Route path="/" element={<Home/>}/>
                      <Route
                          path="/events" element={<Events/>}
                      />
                      <Route path="/contact" element={<Contact/>}/>
                      <Route path="/login" element={<Login/>}/>
                      <Route path="/register" element={<Register/>}/>
                  </Routes>
              </Router>
              <ToastContainer/>
          </div>
      </MyErrorBoundary>

  );
};
