import React, { useState, useEffect } from "react";
import { Users, BarChart3, LogOut, ChevronRight, Bot } from "lucide-react";
import "./Menu.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; 
import authService from "../../services/authService";

export function Menu() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [agentName, setAgentName] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.name) {
      setAgentName(user.name);
    }
  }, []);

  const isClientsActive = () => {
    return (
      location.pathname === "/clients" ||
      location.pathname.startsWith("/client-profile")
    );
  };
  const handleLogout = () => {
    authService.logout(); 
    navigate("/login");   
  };

  return (
    <div className="bh-menu-container">
      <div className="bh-logo-section">
        <img
          src="/assets/images/BH-Assurance.png"
          alt="BH ASSURANCE"
          className="bh-logo"
        />
      </div>

      <nav className="bh-nav">
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `bh-menu-item ${
              isClientsActive() ? "bh-menu-item-active" : "bh-menu-item-inactive"
            }`
          }
        >
          <div className="bh-menu-item-content">
            <Users className="bh-menu-icon" />
            <span className="bh-menu-text">Clients</span>
          </div>
          <ChevronRight className="bh-chevron-icon" />
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `bh-menu-item ${
              isActive ? "bh-menu-item-active" : "bh-menu-item-inactive"
            }`
          }
        >
          <div className="bh-menu-item-content">
            <BarChart3 className="bh-menu-icon" />
            <span className="bh-menu-text">Tableau de bord</span>
          </div>
          <ChevronRight className="bh-chevron-icon" />
        </NavLink>

        <NavLink
          to="/chatbot"
          className={({ isActive }) =>
            `bh-menu-item ${
              isActive ? "bh-menu-item-active" : "bh-menu-item-inactive"
            }`
          }
        >
          <div className="bh-menu-item-content">
            <Bot className="bh-menu-icon" />
            <span className="bh-menu-text">Chatbot</span>
          </div>
          <ChevronRight className="bh-chevron-icon" />
        </NavLink>
      </nav>

      <div className="bh-bottom-section">
        <div className="bh-agent-name">{agentName}</div>
        <button className="bh-logout-button" onClick={handleLogout}>
          <LogOut className="bh-logout-icon" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
