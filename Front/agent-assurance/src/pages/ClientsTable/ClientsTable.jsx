"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./ClientsTable.css"

export function ClientsTable({ defaultType = "physique" }) {
  const navigate = useNavigate()
  const [clientType, setClientType] = useState(defaultType)
  const [clientsData, setClientsData] = useState([])
  const [sortField, setSortField] = useState(clientType === "physique" ? "nomPrenom" : "nom")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filters, setFilters] = useState({
    nom: "",
    clientId: "",
    professionActivite: "",
    statut: "",
    priorite: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState("checking")
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Configuration basée sur le type de client
  const config = {
    physique: {
      endpoint: "http://localhost:3000/clients-physiques",
      fields: {
        nom: { label: "Nom et Prénom", key: "nomPrenom" },
        professionActivite: { label: "Profession", key: "profession" }
      },
      transformData: (data) => data.map(client => ({
        nom: client.nom_prenom || 'Non spécifié',
        clientId: client.ref_personne || 'N/A',
        professionActivite: client.lib_profession || 'Non spécifié',
        statut: client.sous_equipe ? "Sous-équipé" : "Bien équipé",
        priorite: client.urgence || "Moyenne"
      }))
    },
    morale: {
      endpoint: "http://localhost:3000/clients-morales",
      fields: {
        nom: { label: "Raison Sociale", key: "nom" },
        professionActivite: { label: "Activité", key: "activite" }
      },
      transformData: (data) => data.map(client => ({
        nom: client.raison_sociale || 'Non spécifié',
        clientId: client.ref_personne || 'N/A',
        professionActivite: client.lib_activite || 'Non spécifié',
        statut: client.sous_equipe ? "Sous-équipé" : "Bien équipé",
        priorite: client.urgence || "Moyenne"
      }))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setApiStatus("checking")
        
        const currentConfig = config[clientType]
        const response = await fetch(currentConfig.endpoint, {
          headers: {
            'Accept': 'application/json',
          },
        })
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Le serveur a renvoyé un type de contenu non-JSON: ${contentType}`)
        }
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setApiStatus("online")
        
        if (!Array.isArray(data)) {
          throw new Error("Les données reçues ne sont pas un tableau")
        }
        
        if (data.length === 0) {
          setError("Aucune donnée disponible dans la base de données")
        }
        
        // Transformation des données selon le type
        const transformedData = currentConfig.transformData(data)
        setClientsData(transformedData)
      } catch (err) {
        console.error("Erreur API détaillée:", err)
        setApiStatus("offline")
        setError(`Erreur de connexion: ${err.message}. Le serveur est inaccessible.`)
        setClientsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clientType])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setCurrentPage(1) // Réinitialiser à la première page lors du filtrage
  }

  const filteredAndSortedClients = clientsData
    .filter((client) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const clientValue = client[key]?.toString().toLowerCase() || ""
        return clientValue.includes(value.toLowerCase())
      })
    )
    .sort((a, b) => {
      const aValue = a[sortField]?.toString() || ""
      const bValue = b[sortField]?.toString() || ""
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  // Calculs pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedClients.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage)

  const getStatutClass = (statut) =>
    statut === "Bien équipé" ? "statut-bien-equipe" : "statut-sous-equipe"

  const getPrioriteClass = (priorite) => {
    switch (priorite) {
      case "Urgent":
        return "priorite-urgent"
      case "Moyenne":
        return "priorite-moyenne"
      case "Faible":
        return "priorite-faible"
      default:
        return ""
    }
  }

  const retryConnection = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Fonction pour naviguer vers le profil du client
  const viewClientProfile = (clientId, e) => {
    if (e) e.stopPropagation()
    navigate(`/client-profile/${clientType}/${clientId}`)
  }

  // Fonction pour gérer le clic sur une ligne
  const handleRowClick = (clientId) => {
    navigate(`/client-profile/${clientType}/${clientId}`)
  }

  // Fonction pour changer le type de client
  const toggleClientType = (type) => {
    setClientType(type)
    setCurrentPage(1)
    setFilters({
      nom: "",
      clientId: "",
      professionActivite: "",
      statut: "",
      priorite: "",
    })
  }

  if (loading) {
    return (
      <div className="clients-table-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des données depuis l'API...</p>
          <p className="status-indicator">Vérification du statut du serveur</p>
        </div>
      </div>
    )
  }

  return (
    <div className="clients-table-container">
      <div className="header-section">
        <h1 className="clients-table-title">Tableau clients</h1>
        <div className="client-type-toggle">
          <button 
            className={`client-type-button ${clientType === "physique" ? "active" : ""}`}
            onClick={() => toggleClientType("physique")}
          >
            Physique
          </button>
          <button 
            className={`client-type-button ${clientType === "morale" ? "active" : ""}`}
            onClick={() => toggleClientType("morale")}
          >
            Morale
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-row">
        {/* Filtre texte pour Nom/Raison Sociale */}
        <div className="filter-group">
          <label className="filter-label">{config[clientType].fields.nom.label}</label>
          <input
            type="text"
            className="text-filter"
            value={filters.nom}
            onChange={(e) => handleFilterChange("nom", e.target.value)}
            placeholder="Rechercher..."
          />
        </div>

        {/* Filtre texte pour ID Client */}
        <div className="filter-group">
          <label className="filter-label">Référence Client</label>
          <input
            type="text"
            className="text-filter"
            value={filters.clientId}
            onChange={(e) => handleFilterChange("clientId", e.target.value)}
            placeholder="Rechercher..."
          />
        </div>

        {/* Filtre texte pour Profession/Activité */}
        <div className="filter-group">
          <label className="filter-label">{config[clientType].fields.professionActivite.label}</label>
          <input
            type="text"
            className="text-filter"
            value={filters.professionActivite}
            onChange={(e) => handleFilterChange("professionActivite", e.target.value)}
            placeholder="Rechercher..."
          />
        </div>

        {/* Liste déroulante pour Statut */}
        <div className="filter-group">
          <label className="filter-label">Statut</label>
          <select
            className="column-filter-external"
            value={filters.statut}
            onChange={(e) => handleFilterChange("statut", e.target.value)}
          >
            <option value="">Tous</option>
            <option value="Bien équipé">Bien équipé</option>
            <option value="Sous-équipé">Sous-équipé</option>
          </select>
        </div>

        {/* Liste déroulante pour Priorité */}
        <div className="filter-group">
          <label className="filter-label">Priorité</label>
          <select
            className="column-filter-external"
            value={filters.priorite}
            onChange={(e) => handleFilterChange("priorite", e.target.value)}
          >
            <option value="">Tous</option>
            <option value="Urgent">Urgent</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Faible">Faible</option>
          </select>
        </div>
      </div>

      {/* Contrôles de pagination en haut */}
      <div className="pagination-controls">
        <div className="pagination-info">
          Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredAndSortedClients.length)} sur {filteredAndSortedClients.length} clients
        </div>
        <div className="pagination-options">
          <label>
            Clients par page:
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>

      {/* Tableau */}
      <div className="table-wrapper">
        <table className="clients-table">
          <thead className="table-header">
            <tr>
              <th>{config[clientType].fields.nom.label}</th>
              <th>Référence Client</th>
              <th>{config[clientType].fields.professionActivite.label}</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {currentItems.length > 0 ? (
              currentItems.map((client, index) => (
                <tr 
                  key={index} 
                  className="client-row"
                  onClick={() => handleRowClick(client.clientId)}
                >
                  <td>{client.nom}</td>
                  <td>{client.clientId}</td>
                  <td>{client.professionActivite}</td>
                  <td className={getStatutClass(client.statut)}>{client.statut}</td>
                  <td>
                    <div className="priorite-container">
                      <div
                        className={`priorite-dot ${getPrioriteClass(
                          client.priorite
                        )}`}
                      ></div>
                      {client.priorite}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="view-more-button"
                      onClick={(e) => viewClientProfile(client.clientId, e)}
                    >
                      Voir plus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Aucun client trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contrôles de pagination en bas */}
      {filteredAndSortedClients.length > 0 && (
        <div className="pagination-controls bottom">
          <div className="pagination-buttons">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Précédent
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
              // Afficher seulement un sous-ensemble des pages pour ne pas surcharger l'interface
              if (
                number === 1 || 
                number === totalPages || 
                (number >= currentPage - 1 && number <= currentPage + 1)
              ) {
                return (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                )
              } else if (
                number === currentPage - 2 ||
                number === currentPage + 2
              ) {
                return <span key={number} className="pagination-ellipsis">...</span>
              }
              return null
            })}
            
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}