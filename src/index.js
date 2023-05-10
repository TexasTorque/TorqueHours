import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./pages/Home.jsx"
import Leaderboard from "./pages/Leaderboard.jsx"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import AddUser from "./pages/AddUser.jsx"
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/add" element={<AddUser />} />
      </Routes>
  </Router>
);
