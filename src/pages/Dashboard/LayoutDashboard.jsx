import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Content from "../../components/Content/Content";
import ProtectedRoute from "../../components/ProtectedRoute";

const LayoutDashboard = () => {
  const token = localStorage.getItem("token");
  // console.log("Token:", token);
  return (
    <div className="app">
      <ProtectedRoute isAuthenticated={token}>
        <Sidebar />
        <Content />
      </ProtectedRoute>
    </div>
  );
};

export default LayoutDashboard;
