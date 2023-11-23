"use client"

import "./ContentMain.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../Pages/Dashboard/Dashboard/Dashboard";
import GuestPage from "../../Pages/Dashboard/Guest/Guest";
import VillaPage from "../../Pages/Dashboard/Villa/Villa";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/villa" element={<VillaPage />} />
      </Routes>
    </div>
  );
};

export default ContentMain;
