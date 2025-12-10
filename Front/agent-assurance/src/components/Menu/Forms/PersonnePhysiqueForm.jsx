import BaseForm from "./BaseForm.jsx"

export class PersonnePhysiqueForm extends BaseForm {
  getInitialData() {
    // Fonction utilitaire pour gérer les valeurs null/undefined/vides et la chaîne "NULL"
    const formatValue = (value) => {
      return value === null || value === undefined || value === "" || value === "NULL" ? "-" : value;
    };

    // Fonction pour formater le code sexe
    const formatCodeSexe = (value) => {
      if (value === "M") return "Masculin";
      if (value === "F") return "Féminin";
      // Pour toute autre valeur (null, undefined, "", "NULL", ou toute autre valeur non reconnue)
      return "-";
    };

    // Utiliser les données passées via initialData si disponibles
    if (this.props.initialData) {
      return {
        REF_PERSONNE: formatValue(this.props.initialData.ref_personne),
        NOM_PRENOM: formatValue(this.props.initialData.nom_prenom),
        DATE_NAISSANCE: formatValue(this.props.initialData.date_naissance),
        LIEU_NAISSANCE: formatValue(this.props.initialData.lieu_naissance),
        CODE_SEXE: formatCodeSexe(this.props.initialData.code_sexe),
        SITUATION_FAMILIALE: formatValue(this.props.initialData.situation_familiale),
        NUM_PIECE_IDENTITE: formatValue(this.props.initialData.num_piece_identite),
        LIB_SECTEUR_ACTIVITE: formatValue(this.props.initialData.lib_secteur_activite),
        LIB_PROFESSION: formatValue(this.props.initialData.lib_profession),
        VILLE: formatValue(this.props.initialData.ville),
        LIB_GOUVERNORAT: formatValue(this.props.initialData.lib_gouvernorat),
        VILLE_GOUVERNORAT: formatValue(this.props.initialData.ville_gouvernorat),
      };
    }
    
    // Données par défaut si aucune donnée n'est passée
    return {
      REF_PERSONNE: "",
      NOM_PRENOM: "",
      DATE_NAISSANCE: "",
      LIEU_NAISSANCE: "",
      CODE_SEXE: "",
      SITUATION_FAMILIALE: "",
      NUM_PIECE_IDENTITE: "",
      LIB_SECTEUR_ACTIVITE: "",
      LIB_PROFESSION: "",
      VILLE: "",
      LIB_GOUVERNORAT: "",
      VILLE_GOUVERNORAT: "",
    };
  }

  getFormFields() {
    return [
      { name: "REF_PERSONNE", label: "Référence Personne", required: true },
      { name: "NOM_PRENOM", label: "Nom et Prénom", required: true },
      { name: "DATE_NAISSANCE", label: "Date de Naissance", type: "date", required: true },
      { name: "LIEU_NAISSANCE", label: "Lieu de Naissance", required: true },
      { name: "CODE_SEXE", label: "Sexe", required: true, options: ["M", "F", "Autre"] },
      { name: "SITUATION_FAMILIALE", label: "Situation Familiale", required: true, options: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)"] },
      { name: "NUM_PIECE_IDENTITE", label: "Numéro de Pièce d'Identité", required: true },
      { name: "LIB_SECTEUR_ACTIVITE", label: "Secteur d'Activité", required: true },
      { name: "LIB_PROFESSION", label: "Profession", required: true },
      { name: "VILLE", label: "Ville", required: true },
      { name: "LIB_GOUVERNORAT", label: "Gouvernorat", required: true },
      { name: "VILLE_GOUVERNORAT", label: "Ville et Gouvernorat", required: true },
    ];
  }
}