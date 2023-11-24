"use client"

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from "../../../redux/actions/DashboardActions";
import "./Dashboard.css";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state.dashboard.data);
  const loading = useSelector((state) => state.dashboard.loading);

  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

  if (loading || !dashboardData) {
    return (
      <div className="loading-container">
        <ClipLoader color="#007bff" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="custom-header-container">
        <div className="custom-header-content">
          <h1 className="custom-header-title">Discover Main Dashboard</h1>
          <p className="custom-header-subtitle">
            Explore, add, edit, and delete stunning villas in our management
            system.
          </p>
        </div>
      </div>
      <div className="card-container">
        <div className="card-dashboard card-1">
          <h3>Total Check-Ins</h3>
          <p>{dashboardData.nCheckIn}</p>
        </div>
        <div className="card-dashboard card-2">
          <h3>Total Check-Outs</h3>
          <p>{dashboardData.nCheckOut}</p>
        </div>
        <div className="card-dashboard card-3">
          <h3>Total Villas</h3>
          <p>{dashboardData.nVila}</p>
        </div>
        <div className="card-dashboard card-4">
          <h3>Available Villas</h3>
          <p>{dashboardData.nAvailVila}</p>
        </div>
      </div>

      <h3 className="users-title">Users</h3>
      <table className="users-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Nickname</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.users.map((user, index) => (
            <tr key={index}>
              <td>
                <img
                  src={
                    user.image ||
                    "https://cdn.icon-icons.com/icons2/1378/PNG/256/avatardefault_92824.png"
                  }
                  alt="User"
                />
              </td>
              <td>{user.email}</td>
              <td>{user.fullname}</td>
              <td>{user.nickname}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="rate-reviews-title">Rate & Review</h3>
      <table className="rate-reviews-table">
        <thead>
          <tr>
            <th>Score</th>
            <th>Description</th>
            <th>Created At</th>
            <th>User</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.rateReview.map((review, index) => (
            <tr key={index}>
              <td>{review.score}</td>
              <td>{review.description}</td>
              <td>{new Date(review.createdAt).toLocaleString()}</td>
              <td>{review.Users.fullname}</td>
              <td>{review.Transactions.Vilas.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
