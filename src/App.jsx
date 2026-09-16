import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import AdminPanel from "./pages/AdminPanel";
import GuruPanel from "./pages/GuruPanel";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import GuruDashboard from "./pages/GuruDashboard";
import DebugView from "./pages/DebugView";
import "./App.css";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="app-shell">
          <nav className="navbar">
            <span className="brand">Coupon Engine Demo</span>
            <div className="nav-links">
              <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>Admin Panel</NavLink>
              <NavLink to="/guru" className={({ isActive }) => (isActive ? "active" : "")}>Guru Panel</NavLink>
              <NavLink to="/checkout" className={({ isActive }) => (isActive ? "active" : "")}>Checkout</NavLink>
              <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Admin Dashboard</NavLink>
              <NavLink to="/guru-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Guru Dashboard</NavLink>
              <NavLink to="/debug" className={({ isActive }) => (isActive ? "active" : "")}>Debug View</NavLink>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/guru" element={<GuruPanel />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/guru-dashboard" element={<GuruDashboard />} />
              <Route path="/debug" element={<DebugView />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
