import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./assets/logo.png";
import "./App.css";

// import pages
import { Navbar } from "./components/Navbar/Navbar.jsx";
import { Home } from "./pages/Home/Home.jsx";
import { Contact } from "./pages/Contact/Contact.jsx";
import { Login } from "./pages/Login/Login.jsx";
import { Register } from "./pages/Register/Register.jsx";
import {ToastContainer} from "react-toastify";
import {MyErrorBoundary} from "./components/MyErrorBoundary/MyErrorBoundary.jsx";
import {CreateEvents} from "./pages/CreateEvents/CreateEvents.jsx";
import {MyInvitations} from "./pages/MyInvitaions/MyInvitations.jsx";


export const App = () => {

  return (

      <MyErrorBoundary>
          <div className="app">
              <Router>
                  <Navbar logo={logo}/>
                  <Routes>
                      <Route path="/" element={<Home/>}/>
                      <Route
                          path="/events/create-events" element={<CreateEvents/>}
                      />
                      <Route
                          path="/events/my-invitations" element={<MyInvitations/>}
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
