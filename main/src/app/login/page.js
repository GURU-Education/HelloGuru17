"use client";
import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import Login from "../_components/login";
import Welcome from "./welcome";
import Signup from "./signup";
import HomePage from "./homepage";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("welcome");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentPage("home");
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        {currentPage !== "home" && (
          <div className="spline-container">
            <Spline scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode" />
          </div>
        )}
        <div className={`${currentPage}-container`}>
          {currentPage === "welcome" && <Welcome onNavigate={setCurrentPage} />}
          {currentPage === "login" && <Login onNavigate={setCurrentPage} />}
          {currentPage === "signup" && <Signup onNavigate={setCurrentPage} />}
          {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        </div>
      </div>
    </div>
  );
}
