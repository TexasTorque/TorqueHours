import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from "./pages/Login.jsx"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Routes>
          <Route path="/" element={<Login />} />
      </Routes>
  </Router>
);
