import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./pages/Home.jsx"
import Leaderboard from "./pages/Leaderboard.jsx"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Admin from "./pages/Admin.jsx"
import Attendance from "./pages/Attendance.jsx"
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path = "/attendance" element={<Attendance />} />
      </Routes>
  </Router>
);
