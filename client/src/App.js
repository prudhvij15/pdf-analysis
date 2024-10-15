import React, { useState, useEffect } from "react";
import FileUploadComponent from "./components/filehandler";
import LoginForm from "./components/login";
import SignupForm from "./components/singup";
import Header from "./components/Header";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async (email, password) => {
    try {
      await axios.post("http://localhost:3000/api/signup", {
        email,
        password,
      });
      alert("Account created! Please login.");
      setIsSignup(false);
    } catch (error) {
      alert("Signup failed. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="App w-screen min-h-screen flex flex-col bg-slate-900 text-white ml-0 pl-0">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <div>
        {!isLoggedIn ? (
          <div className="flex items-center justify-center  w-full">
            {isSignup ? (
              <SignupForm
                onSignup={handleSignup}
                onToggle={() => setIsSignup(false)}
              />
            ) : (
              <LoginForm
                onLogin={handleLogin}
                onToggle={() => setIsSignup(true)}
              />
            )}
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto">
            <FileUploadComponent />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
