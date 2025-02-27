"use client";
import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
import Spline from "@splinetool/react-spline";
import Login from "./_components/login";
import Welcome from "./_components/welcome";
import Signup from "./_components/signup";
import HomePage from "./_components/homepage";
import "./page.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  const [currentPage, setCurrentPage] = useState("welcome");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentPage("home");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <div className="container">
          {currentPage !== "home" && (
            <div className="spline-container">
              <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
            </div>
          )}
          <div className={`${currentPage}-container`}>
            {currentPage === "welcome" && (
              <Welcome onNavigate={setCurrentPage} />
            )}
            {currentPage === "login" && <Login onNavigate={setCurrentPage} />}
            {currentPage === "signup" && <Signup onNavigate={setCurrentPage} />}
            {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
