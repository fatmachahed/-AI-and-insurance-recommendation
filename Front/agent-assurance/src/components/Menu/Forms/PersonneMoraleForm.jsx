import BaseForm from "./BaseForm.jsx"

export class PersonneMoraleForm extends BaseForm {
  getInitialData() {
    // Fonction utilitaire pour gérer les valeurs null/undefined/vides
     const formatValue = (value) => {
      return value === null || value === undefined || value === "" || value === "NULL" ? "-" : value;
    };

    // Utiliser les données passées via initialData si disponibles
    if (this.props.initialData) {
      return {
        raison_sociale: formatValue(this.props.initialData.raison_sociale),
        matricule_fiscale: formatValue(this.props.initialData.matricule_fiscale),
        lib_secteur_activite: formatValue(this.props.initialData.lib_secteur_activite),
        lib_activite: formatValue(this.props.initialData.lib_activite),
        formeJuridique: formatValue(this.props.initialData.formeJuridique),
        adresseSiege: formatValue(this.props.initialData.adresseSiege),
        numeroFiscal: formatValue(this.props.initialData.numeroFiscal),
        ville: formatValue(this.props.initialData.ville),
        lib_gouvernorat: formatValue(this.props.initialData.lib_gouvernorat),
        ville_gouvernorat: formatValue(this.props.initialData.ville_gouvernorat),
      };
    }
    
    // Données par défaut si aucune donnée n'est passée
    return {
      raison_sociale: "",
      matricule_fiscale: "",
      lib_secteur_activite: "",
      lib_activite: "",
      formeJuridique: "",
      adresseSiege: "",
      numeroFiscal: "",
      ville: "",
      lib_gouvernorat: "",
      ville_gouvernorat: "",
    };
  }

  getFormFields() {
    return [
      { name: "raison_sociale", label: "Raison sociale", required: true },
      { name: "matricule_fiscale", label: "Matricule fiscale", required: false },
      { name: "lib_secteur_activite", label: "Secteur d'activité", required: false },
      { name: "lib_activite", label: "Activité", required: false },
      { name: "formeJuridique", label: "Forme juridique", required: true },
      { name: "adresseSiege", label: "Adresse du siège", required: true },
      { name: "numeroFiscal", label: "Numéro fiscal", required: true },
      { name: "ville", label: "Ville", required: false },
      { name: "lib_gouvernorat", label: "Gouvernorat", required: false },
      { name: "ville_gouvernorat", label: "Ville et gouvernorat", required: false },
    ];
  }
}