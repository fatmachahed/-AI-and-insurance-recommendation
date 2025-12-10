import { useState, useEffect } from "react"
import "./Dashboard.css"

export function Dashboard() {
  const [historiqueData, setHistoriqueData] = useState([])
  const [contratData, setContratData] = useState([])
  const [clientsPhysiques, setClientsPhysiques] = useState([])
  const [clientsMorales, setClientsMorales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [
          historiqueResponse,
          contratResponse,
          clientsPhysiquesResponse,
          clientsMoralesResponse
        ] = await Promise.all([
          fetch("http://localhost:3000/historique", { headers: { 'Accept': 'application/json' }}),
          fetch("http://localhost:3000/contrats", { headers: { 'Accept': 'application/json' }}),
          fetch("http://localhost:3000/clients-physiques", { headers: { 'Accept': 'application/json' }}),
          fetch("http://localhost:3000/clients-morales", { headers: { 'Accept': 'application/json' }})
        ])

        if (!historiqueResponse.ok) throw new Error(`Erreur HTTP historique: ${historiqueResponse.status}`)
        if (!contratResponse.ok) throw new Error(`Erreur HTTP contrats: ${contratResponse.status}`)
        if (!clientsPhysiquesResponse.ok) throw new Error(`Erreur HTTP clients physiques: ${clientsPhysiquesResponse.status}`)
        if (!clientsMoralesResponse.ok) throw new Error(`Erreur HTTP clients morales: ${clientsMoralesResponse.status}`)

        setHistoriqueData(await historiqueResponse.json())

        setContratData(await contratResponse.json())
        setClientsPhysiques(await clientsPhysiquesResponse.json())
        setClientsMorales(await clientsMoralesResponse.json())
        

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  // Calcul des statistiques des messages
  const messageStats = {
    total: historiqueData.length,
    acceptes: historiqueData.filter(item => item.REPONSE === "ACCEPTE ").length,
    refuses: historiqueData.filter(item => item.REPONSE === "REFUSE").length,
    enAttente: historiqueData.filter(item => item.REPONSE === "EN ATTENTE").length,
  }

  // Calcul du nombre de souscriptions en cours
  const nombreSouscriptions = contratData.filter(contrat => 
    contrat.LIB_ETAT_CONTRAT === "EN COURS"
  ).length

  // Calcul des statistiques des canaux
  const canalStats = {
    email: historiqueData.filter(item => item.CANEAU === "Email").length,
    whatsapp: historiqueData.filter(item => item.CANEAU === "Whatsapp").length,
    telephone: historiqueData.filter(item => item.CANEAU === "Téléphone").length,
  }

  // Calcul des pourcentages pour le graphique en donut
  const totalCanaux = canalStats.email + canalStats.whatsapp + canalStats.telephone
  const emailPercentage = totalCanaux > 0 ? (canalStats.email / totalCanaux) * 100 : 0
  const whatsappPercentage = totalCanaux > 0 ? (canalStats.whatsapp / totalCanaux) * 100 : 0
  const telephonePercentage = totalCanaux > 0 ? (canalStats.telephone / totalCanaux) * 100 : 0

  // Calcul des circonférences pour le graphique en donut
  const circumference = 2 * Math.PI * 40
  const emailDashoffset = circumference - (emailPercentage / 100) * circumference
  const whatsappDashoffset = circumference - (whatsappPercentage / 100) * circumference
  const telephoneDashoffset = circumference - (telephonePercentage / 100) * circumference

  const totalUrgent = [...clientsPhysiques, ...clientsMorales]
  .filter(c => c.urgence === "Urgent").length


  // Création d'un objet avec les catégories de situation familiale
// Extraire toutes les situations distinctes
    const situationsDistinctes = [...new Set(clientsPhysiques.map(c => c.situation_familiale).filter(s => s.trim() !== ''))];

    // Comptage dynamique des sous-équipés pour chaque situation
    const sousEquipeParSituation = situationsDistinctes.map(sit => ({
      situation: sit,
      count: clientsPhysiques.filter(c => c.sous_equipe && c.situation_familiale === sit).length
    }));
  


    // --- Répartition sous-équipés / bien équipés ---
  const allClients = [...clientsPhysiques, ...clientsMorales]
  const totalBienEquipe = allClients.filter(c => c.sous_equipe === false).length
  const totalSousEquipe = allClients.filter(c => c.sous_equipe === true).length
  const totalClients = totalBienEquipe + totalSousEquipe
  const pourcentageBienEquipe = totalClients > 0 ? (totalBienEquipe / totalClients) * 100 : 0
  const pourcentageSousEquipe = totalClients > 0 ? (totalSousEquipe / totalClients) * 100 : 0

  // --- Fonction pour créer les arcs du pie-chart ---
  const createArc = (startAngle, endAngle, radius, cx = 60, cy = 60) => {
    const startX = cx + radius * Math.cos(startAngle)
    const startY = cy + radius * Math.sin(startAngle)
    const endX = cx + radius * Math.cos(endAngle)
    const endY = cy + radius * Math.sin(endAngle)
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0
    return `M${cx},${cy} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`
  }

  
  if (loading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Tableau de bord général</h1>
        <div className="loading">Chargement des données...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Tableau de bord général</h1>
        <div className="error-message">Erreur: {error}</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Tableau de bord général</h1>

      <div className="metrics-grid">
        <div className="metric-card teal">
          <div className="metric-label">Taux d'engagement</div>
          <div className="metric-value">
            {messageStats.total > 0 
              ? Math.round((messageStats.acceptes / messageStats.total) * 100) 
              : 0} %
          </div>
        </div>
        <div className="metric-card coral">
          <div className="metric-label">Précision des recommandations</div>
          <div className="metric-value">45 %</div>
        </div>
        <div className="metric-card orange">
          <div className="metric-label">Taux de couverture</div>
          <div className="metric-value">50 %</div>
        </div>
        <div className="metric-card pink">
          <div className="metric-label">Souscriptions urgentes</div>
          <div className="metric-value">{totalUrgent}</div>
        </div>
        <div className="metric-card teal">
          <div className="metric-label">Nombre Souscriptions</div>
          <div className="metric-value">{nombreSouscriptions}</div>
        </div>
      </div>

      <div className="messages-section">
    
        <div className="messages-stats">
            <div className="messages-title">Nombre de messages</div>


          <div className="message-stat">
            <span className="dot black"></span>
            <span className="label">Envoyés</span>
            <span className="value">{messageStats.total}</span>
          </div>
          <div className="message-stat">
            <span className="dot teal"></span>
            <span className="label">Acceptés</span>
            <span className="value">{messageStats.acceptes}</span>
          </div>
          <div className="message-stat">
            <span className="dot red"></span>
            <span className="label">Refusés</span>
            <span className="value">{messageStats.refuses}</span>
          </div>
          <div className="message-stat">
            <span className="dot orange"></span>
            <span className="label">En attente</span>
            <span className="value">{messageStats.enAttente}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
          <div className="chart-card">
        <h3>Sous-équipés par situation familiale</h3>
        <div className="bar-chart">
          {sousEquipeParSituation.map((item, index) => (
            <div
              key={index}
              className="bar"
              style={{ height: `${item.count * 10}px` }}
            ></div>
          ))}
        </div>
        <div className="chart-labels">
          {sousEquipeParSituation.map((item, index) => (
            <span key={index}>{item.situation}</span>
          ))}
        </div>
      </div>


      <div className="chart-card">
        <h3>Efficacité des canaux</h3>
        <div className="donut-chart">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Cercle de fond */}
            <circle cx="60" cy="60" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
            
            {/* Segment pour l'email */}
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray={`${(emailPercentage / 100) * 251.2} 251.2`}
              strokeDashoffset="0"
              transform="rotate(-90 60 60)"
            />
            
            {/* Segment pour WhatsApp */}
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="20"
              strokeDasharray={`${(whatsappPercentage / 100) * 251.2} 251.2`}
              strokeDashoffset={`-${(emailPercentage / 100) * 251.2}`}
              transform="rotate(-90 60 60)"
            />
            
            {/* Segment pour le téléphone */}
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="#6b7280"
              strokeWidth="20"
              strokeDasharray={`${(telephonePercentage / 100) * 251.2} 251.2`}
              strokeDashoffset={`-${((emailPercentage + whatsappPercentage) / 100) * 251.2}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span>E-mail: {Math.round(emailPercentage)}%</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot blue"></span>
            <span>WhatsApp: {Math.round(whatsappPercentage)}%</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span>
            <span>Téléphone: {Math.round(telephonePercentage)}%</span>
          </div>
        </div>
      </div>

      {/* --- Graphique répartition équipement dynamique --- */}
      <div className="chart-card">
        <h3>Répartition équipement</h3>
        <div className="pie-chart">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Arc sous-équipés */}
            <path d={createArc(-Math.PI / 2, (-Math.PI / 2 + (pourcentageSousEquipe / 100) * 2 * Math.PI), 50)} fill="#ef4444" />
            {/* Arc bien équipés */}
            <path d={createArc((-Math.PI / 2 + (pourcentageSousEquipe / 100) * 2 * Math.PI), Math.PI * 1.5, 50)} fill="#1e293b" />
          </svg>
        </div>
        <div className="pie-legend">
          <div className="legend-item">
            <span className="legend-dot dark-blue"></span>
            <span>Bien équipés</span>
            <span className="percentage">{Math.round(pourcentageBienEquipe)} %</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot red"></span>
            <span>Sous-équipés</span>
            <span className="percentage">{Math.round(pourcentageSousEquipe)} %</span>
          </div>
        </div>
      </div>
        
      </div>
    </div>
  )
}