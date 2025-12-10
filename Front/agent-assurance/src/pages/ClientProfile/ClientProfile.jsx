"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { PersonnePhysiqueForm } from "../../components/Menu/Forms/PersonnePhysiqueForm.jsx"
import { PersonneMoraleForm } from "../../components/Menu/Forms/PersonneMoraleForm.jsx"
import "./ClientProfile.css"

const STATIC_MESSAGES = [
  { id: 1, type: "Retraite", date: "10/08/2025", content: "Sécurisez votre avenir sereinement, dès aujourd'hui", status: "Refusé" },
  { id: 2, type: "Travail", date: "08/08/2025", content: "Protégez vous dans votre travail", status: "Nouveau" },
]

const MOCK_CONTRATS = [
  { LIB_PRODUIT: "Santé" },
  { LIB_PRODUIT: "Vie" },
  { LIB_PRODUIT: "Transport" }
]

export function ClientProfile() {
  const { type, id } = useParams()
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contracts, setContracts] = useState([])
  const [contractsLoading, setContractsLoading] = useState(false)
  const [contractsError, setContractsError] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [recsLoading, setRecsLoading] = useState(false)
  const [recsError, setRecsError] = useState(null)
  const [llmMessage, setLlmMessage] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id || !type) return
      try {
        setLoading(true)
        setError(null)
        const endpoint = type === "morale" 
          ? `http://localhost:3000/clients-morales/${id}`
          : `http://localhost:3000/clients-physiques/${id}`
        const res = await fetch(endpoint)
        if (res.ok) {
          const data = await res.json()
          setClientData(data)
          if (data.ref_personne) {
            await fetchClientContracts(data.ref_personne)
            await fetchClientRecommendations(data.ref_personne)
          } else setContracts(MOCK_CONTRATS)
        } else throw new Error(`Client avec l'ID ${id} non trouvé (${res.status} ${res.statusText})`)
      } catch (err) {
        setError(err.message)
        setContracts(MOCK_CONTRATS)
      } finally {
        setLoading(false)
      }
    }

    const fetchClientContracts = async (ref) => {
      try {
        setContractsLoading(true)
        setContractsError(null)
        const contractsEndpoint = `http://localhost:3000/contrats/client/${ref}`
        const contractsRes = await fetch(contractsEndpoint)
        if (contractsRes.ok) {
          const contractsData = await contractsRes.json()
          setContracts(Array.isArray(contractsData) ? contractsData : [])
        } else {
          setContractsError(`Erreur ${contractsRes.status}: Impossible de charger les contrats`)
          setContracts(MOCK_CONTRATS)
        }
      } catch (err) {
        setContractsError("Erreur de connexion lors du chargement des contrats")
        setContracts(MOCK_CONTRATS)
      } finally {
        setContractsLoading(false)
      }
    }

    const fetchClientRecommendations = async (ref) => {
      try {
        setRecsLoading(true)
        setRecsError(null)
        const recsEndpoint = `http://localhost:3000/recommandations/llm?client=${encodeURIComponent(JSON.stringify(clientData))}&produit=`
        // Pour le moment on ne charge que la liste de recommandations existantes
        const recsRes = await fetch(`http://localhost:3000/opportunites/client/${ref}`)
        if (recsRes.ok) {
          const recsData = await recsRes.json()
          setRecommendations(Array.isArray(recsData) ? recsData : [])
        } else {
          setRecsError(`Erreur ${recsRes.status}: Impossible de charger les recommandations`)
          setRecommendations([])
        }
      } catch (err) {
        setRecsError("Erreur de connexion lors du chargement des recommandations")
        setRecommendations([])
      } finally {
        setRecsLoading(false)
      }
    }

    fetchClientData()
  }, [id, type])

  const handleFormSubmit = async (formData) => {
    try {
      const endpoint = type === "morale" 
        ? `http://localhost:3000/clients-morales/${id}`
        : `http://localhost:3000/clients-physiques/${id}`
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Erreur lors de la mise à jour")
      const updatedData = await response.json()
      setClientData(updatedData)
      alert("Données mises à jour avec succès!")
    } catch (err) {
      alert("Erreur lors de la mise à jour des données")
    }
  }

  const handleSendMessage = async (rec) => {
    if (!clientData) return
    try {
      const clientStr = encodeURIComponent(JSON.stringify(clientData))
      const produit = encodeURIComponent(rec.PRODUIT_REC)
      const res = await fetch(`http://localhost:3000/recommandations/llm?client=${clientStr}&produit=${produit}`)
      const data = await res.json()
      if (data.argumentaire) {
        setLlmMessage(data.argumentaire)
        setShowPopup(true)
      }
    } catch (err) {
      console.error("Erreur génération LLM :", err)
    }
  }

  if (loading) return <div className="loading">Chargement des données du client...</div>
  if (error) return <div className="error">Erreur : {error}</div>
  if (!clientData) return <div className="no-data">Aucun client trouvé.</div>

  const inProgressContracts = contracts.filter(c => c.LIB_ETAT_CONTRAT === "EN COURS")
  const uniqueContracts = Array.from(new Map(inProgressContracts.map(c => [c.LIB_PRODUIT, c])).values())

  return (
    <div className="client-profile">
      <div className="profile-content">
        <div className="client-info-section">
          <div className="form-container">
            {type === "morale" ? (
              <PersonneMoraleForm title="Informations sur l'entreprise" initialData={clientData} onSubmit={handleFormSubmit} />
            ) : (
              <PersonnePhysiqueForm title="Informations sur le client" initialData={clientData} onSubmit={handleFormSubmit} />
            )}
          </div>

          <div className="contracts-section">
            <h3>Les contrats</h3>
            {contractsLoading ? (
              <p>Chargement des contrats...</p>
            ) : contractsError ? (
              <p className="error">{contractsError}</p>
            ) : uniqueContracts.length > 0 ? (
              <div className="contracts-buttons">
                {uniqueContracts.map((contract, index) => (
                  <button key={index} className="contract-button">
                    {contract.LIB_PRODUIT || "Contrat sans nom"}
                  </button>
                ))}
              </div>
            ) : <p className="center-message">Aucun contrat en cours pour ce client</p>}
          </div>

          <div className="recommendations-section">
            <h3>Les recommandations</h3>
            {recsLoading ? (
              <p>Chargement des recommandations...</p>
            ) : recsError ? (
              <p className="error">{recsError}</p>
            ) : recommendations.length > 0 ? (
              <div className="recommendations-grid">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rec-header">
                      <span className="rec-type">{rec.PRODUIT_REC}</span>
                    </div>
                    <div className="rec-actions">
                      <button
                        className="rec-action-btn message-btn"
                        onClick={() => handleSendMessage(rec)}
                      >
                        Message
                      </button>
                      <button className="rec-action-btn email-btn">Envoyer un e-mail</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="center-message">Actuellement, aucune recommandation n’est disponible pour ce client</p>
            )}
          </div>
        </div>

        <div className="messages-section">
          <h3>Les messages</h3>
          <div className="messages-container">
            {STATIC_MESSAGES.map((message) => (
              <div key={message.id} className="conversation-wrapper">
                <div className="message-item">
                  <div className="message-header">
                    <span className="message-type">{message.type}</span>
                    <span className="message-date">{message.date}</span>
                  </div>
                  <div className="message-bubble">{message.content}</div>
                  <div className={`message-status ${message.status.toLowerCase()}`}>{message.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 Popup LLM */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h4>Message généré :</h4>
            <p>{llmMessage}</p>
            <button onClick={() => setShowPopup(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}
