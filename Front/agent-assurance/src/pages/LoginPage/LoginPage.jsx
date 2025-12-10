"use client"
import React from "react";
import { useState } from "react";
import authService from "../../services/authService";
import './LoginPage.css';

export function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Nouvel état pour le type de message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await authService.login(login, password);
      setMessage("Connexion réussie ! Redirection...");
      setMessageType("success-message"); // Définit le type de message comme "succès"
      
      // Retard avant la redirection pour que le message soit visible
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Identifiants incorrects. Veuillez réessayer.");
      setMessageType("error-message"); // Définit le type de message comme "erreur"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="title-container">
            <h1 className="login-title">
              Bienvenue
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="form-content">
            <div className="input-group">
              <label htmlFor="login" className="form-label">
                Login
              </label>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Chargement..." : "Se connecter"}
            </button>
            {/* Ajoute dynamiquement la classe en fonction du type de message */}
            {message && <div className={`login-message ${messageType}`}>{message}</div>}
          </form>
        </div>
      </div>
      <div className="description-section">
        <div className="description-content">
          <img src="/assets/images/BH-Assurance.png" alt="BH ASSURANCE" className="logo" />
          <p className="description-text">
            Connectez-vous pour transformer chaque interaction client en opportunité de vente personnalisée avec l'IA
          </p>
        </div>
      </div>
    </div>
  );
}