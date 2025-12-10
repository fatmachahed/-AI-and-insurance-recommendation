// src/clients/clients.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';

import { ClientMorale } from '../clients-morales/entities/clients-morale.entity';
import { ClientPhysique } from '../clients-physiques/entities/clients-physique.entity';
import { Contrat } from '../contrats/entities/contrat.entity';
import { Sinistre } from '../sinistres/entities/sinistre.entity';
import { MappingProduit } from '../mapping-produit/entities/mapping-produit.entity';
import { Opportunite } from '../opportunites/entities/opportunite.entity';
import { Historique } from '../historique/entities/historique.entity';

// 🔹 Interfaces pour typer les lignes Excel
interface MoraleRow { REF_PERSONNE: string; RAISON_SOCIALE: string; MATRICULE_FISCALE?: string; LIB_SECTEUR_ACTIVITE?: string; LIB_ACTIVITE?: string; VILLE?: string; LIB_GOUVERNORAT?: string; VILLE_GOUVERNORAT?: string; }
interface PhysiqueRow { REF_PERSONNE: string; NOM_PRENOM: string; DATE_NAISSANCE?: string; LIEU_NAISSANCE?: string; CODE_SEXE?: string; SITUATION_FAMILIALE?: string; NUM_PIECE_IDENTITE?: string; LIB_SECTEUR_ACTIVITE?: string; LIB_PROFESSION?: string; VILLE?: string; LIB_GOUVERNORAT?: string; VILLE_GOUVERNORAT?: string; }
interface ContratRow { REF_PERSONNE: string; NUM_CONTRAT: string; LIB_PRODUIT: string; EFFET_CONTRAT: string; DATE_EXPIRATION?: string; PROCHAIN_TERME?: string; LIB_ETAT_CONTRAT: string; BRANCHE: string; SOMME_QUITTANCES?: number; STATUT_PAIEMENT?: string; CAPITAL_ASSURE?: number; }
interface SinistreRow { NUM_SINISTRE: string; NUM_CONTRAT: string; LIB_BRANCHE: string; LIB_SOUS_BRANCHE: string; LIB_PRODUIT: string; NATURE_SINISTRE: string; LIB_TYPE_SINISTRE: string; TAUX_RESPONSABILITE?: number; DATE_SURVENANCE?: string; DATE_DECLARATION?: string; DATE_OUVERTURE?: string; OBSERVATION_SINISTRE?: string; LIB_ETAT_SINISTRE: string; LIEU_ACCIDENT?: string; MOTIF_REOUVERTURE?: string; MONTANT_ENCAISSE?: number; MONTANT_A_ENCAISSER?: number; }
interface MappingProduitRow { LIB_BRANCHE: string; LIB_SOUS_BRANCHE: string; LIB_PRODUIT: string; }
interface OpportuniteRow { REF_PERSONNE: string; PRODUIT_REC: string; ARGUMENTATIVE?: string; STATUT: string; }
interface HistoriqueRow { REF_PERSONNE: string; DATE?: string; CANEAU?: string; REPONSE: string; }

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientMorale) private readonly moraleRepo: Repository<ClientMorale>,
    @InjectRepository(ClientPhysique) private readonly physiqueRepo: Repository<ClientPhysique>,
    @InjectRepository(Contrat) private readonly contratRepo: Repository<Contrat>,
    @InjectRepository(Sinistre) private readonly sinistreRepo: Repository<Sinistre>,
    @InjectRepository(MappingProduit) private readonly mappingRepo: Repository<MappingProduit>,
    @InjectRepository(Opportunite) private readonly opportuniteRepo: Repository<Opportunite>,
    @InjectRepository(Historique) private readonly historiqueRepo: Repository<Historique>,
  ) {}

  private parseExcelDate(date?: string): string | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
  }

  async importFromExcel(filePath: string) {
    const workbook = xlsx.readFile(filePath);
    console.log('Feuilles disponibles dans le fichier Excel:', workbook.SheetNames);

    // 🔹 Helper pour log et insert
    const insertRows = async (repo: Repository<any>, rows: any[], entityName: string) => {
      console.log(`Import de ${rows.length} lignes pour ${entityName}`);
      for (const [index, row] of rows.entries()) {
        try {
          await repo.createQueryBuilder().insert().values(row).execute();
          console.log(`✅ Ligne ${index + 1} insérée dans ${entityName}`);
        } catch (err) {
          console.error(`❌ Erreur insertion ligne ${index + 1} dans ${entityName}:`, err.message);
        }
      }
    };

    // 🔹 Clients morales
    const sheetMorales = workbook.Sheets['personne_morale'];
    if (sheetMorales) {
      const data: MoraleRow[] = xlsx.utils.sheet_to_json(sheetMorales);
      const rows = data.map(row => ({
        ref_personne: row.REF_PERSONNE,
        raison_sociale: row.RAISON_SOCIALE,
        matricule_fiscale: row.MATRICULE_FISCALE,
        lib_secteur_activite: row.LIB_SECTEUR_ACTIVITE,
        lib_activite: row.LIB_ACTIVITE,
        ville: row.VILLE,
        lib_gouvernorat: row.LIB_GOUVERNORAT,
        ville_gouvernorat: row.VILLE_GOUVERNORAT,
      }));
      await insertRows(this.moraleRepo, rows, 'ClientMorale');
    }

    // 🔹 Clients physiques
    const sheetPhysiques = workbook.Sheets['personne_physique'];
    if (sheetPhysiques) {
      const data: PhysiqueRow[] = xlsx.utils.sheet_to_json(sheetPhysiques);
      const rows = data.map(row => ({
        ref_personne: row.REF_PERSONNE,
        nom_prenom: row.NOM_PRENOM,
        date_naissance: this.parseExcelDate(row.DATE_NAISSANCE),
        lieu_naissance: row.LIEU_NAISSANCE,
        code_sexe: row.CODE_SEXE,
        situation_familiale: row.SITUATION_FAMILIALE,
        num_piece_identite: row.NUM_PIECE_IDENTITE,
        lib_secteur_activite: row.LIB_SECTEUR_ACTIVITE,
        lib_profession: row.LIB_PROFESSION,
        ville: row.VILLE,
        lib_gouvernorat: row.LIB_GOUVERNORAT,
        ville_gouvernorat: row.VILLE_GOUVERNORAT,
      }));
      await insertRows(this.physiqueRepo, rows, 'ClientPhysique');
    }

    // 🔹 Contrats
    const sheetContrats = workbook.Sheets['Contrats'];
    if (sheetContrats) {
      const data: ContratRow[] = xlsx.utils.sheet_to_json(sheetContrats);
      const rows = data.map((row, index) => {
        if (!row.REF_PERSONNE) {
          console.warn(`⚠️ Ligne ${index + 1} ignorée dans Contrat (REF_PERSONNE manquant)`, row);
          return null;
        }
        return {
          REF_PERSONNE: row.REF_PERSONNE,
          NUM_CONTRAT: row.NUM_CONTRAT,
          LIB_PRODUIT: row.LIB_PRODUIT,
          EFFET_CONTRAT: this.parseExcelDate(row.EFFET_CONTRAT),
          DATE_EXPIRATION: this.parseExcelDate(row.DATE_EXPIRATION),
          PROCHAIN_TERME: this.parseExcelDate(row.PROCHAIN_TERME),
          LIB_ETAT_CONTRAT: row.LIB_ETAT_CONTRAT,
          BRANCHE: row.BRANCHE,
          SOMME_QUITTANCES: row.SOMME_QUITTANCES,
          STATUT_PAIEMENT: row.STATUT_PAIEMENT,
          CAPITAL_ASSURE: row.CAPITAL_ASSURE,
        };
      }).filter(row => row !== null);

      await insertRows(this.contratRepo, rows, 'Contrat');
    }

    // 🔹 Sinistres
    const sheetSinistres = workbook.Sheets['sinistres'];
    if (sheetSinistres) {
      const data: SinistreRow[] = xlsx.utils.sheet_to_json(sheetSinistres);
      const rows = data.map((row, index) => {
        if (!row.NUM_SINISTRE) {
          console.warn(`⚠️ Ligne ${index + 1} ignorée dans Sinistre (NUM_SINISTRE manquant)`, row);
          return null;
        }
        return {
          NUM_SINISTRE: row.NUM_SINISTRE,
          NUM_CONTRAT: row.NUM_CONTRAT,
          LIB_BRANCHE: row.LIB_BRANCHE,
          LIB_SOUS_BRANCHE: row.LIB_SOUS_BRANCHE,
          LIB_PRODUIT: row.LIB_PRODUIT,
          NATURE_SINISTRE: row.NATURE_SINISTRE,
          LIB_TYPE_SINISTRE: row.LIB_TYPE_SINISTRE,
          TAUX_RESPONSABILITE: row.TAUX_RESPONSABILITE,
          DATE_SURVENANCE: this.parseExcelDate(row.DATE_SURVENANCE),
          DATE_DECLARATION: this.parseExcelDate(row.DATE_DECLARATION),
          DATE_OUVERTURE: this.parseExcelDate(row.DATE_OUVERTURE),
          OBSERVATION_SINISTRE: row.OBSERVATION_SINISTRE,
          LIB_ETAT_SINISTRE: row.LIB_ETAT_SINISTRE,
          LIEU_ACCIDENT: row.LIEU_ACCIDENT,
          MOTIF_REOUVERTURE: row.MOTIF_REOUVERTURE,
          MONTANT_ENCAISSE: row.MONTANT_ENCAISSE,
          MONTANT_A_ENCAISSER: row.MONTANT_A_ENCAISSER,
        };
      }).filter(row => row !== null);

      await insertRows(this.sinistreRepo, rows, 'Sinistre');
    }

    // 🔹 Mapping produits
    const sheetMapping = workbook.Sheets['Mapping_Produits'];
    if (sheetMapping) {
      const data: MappingProduitRow[] = xlsx.utils.sheet_to_json(sheetMapping);
      const rows = data.map(row => ({
        LIB_BRANCHE: row.LIB_BRANCHE,
        LIB_SOUS_BRANCHE: row.LIB_SOUS_BRANCHE,
        LIB_PRODUIT: row.LIB_PRODUIT,
      }));
      await insertRows(this.mappingRepo, rows, 'MappingProduit');
    }

    // 🔹 Opportunités
    const sheetOpportunites = workbook.Sheets['Opportunites'];
    if (sheetOpportunites) {
      const data: OpportuniteRow[] = xlsx.utils.sheet_to_json(sheetOpportunites);
      const rows = data.map(row => ({
        REF_PERSONNE: row.REF_PERSONNE,
        PRODUIT_REC: row.PRODUIT_REC,
        ARGUMENTATIVE: row.ARGUMENTATIVE,
        STATUT: row.STATUT,
      }));
      await insertRows(this.opportuniteRepo, rows, 'Opportunite');
    }

    // 🔹 Historique
    const sheetHistorique = workbook.Sheets['Historique_contact'];
    if (sheetHistorique) {
      const data: HistoriqueRow[] = xlsx.utils.sheet_to_json(sheetHistorique);
      const rows = data.map(row => ({
        REF_PERSONNE: row.REF_PERSONNE,
        DATE: this.parseExcelDate(row.DATE),
        CANEAU: row.CANEAU,
        REPONSE: row.REPONSE,
      }));
      await insertRows(this.historiqueRepo, rows, 'Historique');
    }

    return { message: 'Import de toutes les entités OK 🚀' };
  }
}
