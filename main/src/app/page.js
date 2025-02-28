"use client";
import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import Login from "./_components/login";
import Welcome from "./_components/welcome";
import Signup from "./_components/signup";
import HomePage from "./_components/homepage";
import "./page.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./_components/home";
const queryClient = new QueryClient();

export default function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
