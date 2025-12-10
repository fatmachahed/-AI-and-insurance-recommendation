import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ContratsService {
  constructor(private dataSource: DataSource) {}

  async getContratsByClient(ref_personne: string) {
    return this.dataSource.query(
      `SELECT "LIB_PRODUIT", "LIB_ETAT_CONTRAT"
       FROM contrat
       WHERE "REF_PERSONNE" = $1`,
      [ref_personne],
    );
  }

  async getSinistresByProduits(produits: string[]) {
    if (produits.length === 0) return [];

    const placeholders = produits.map((_, i) => `$${i + 1}`).join(', ');

    return this.dataSource.query(
      `SELECT "NUM_SINISTRE", "NUM_CONTRAT", "LIB_BRANCHE", "LIB_SOUS_BRANCHE", "LIB_PRODUIT",
              "NATURE_SINISTRE", "LIB_TYPE_SINISTRE", "OBSERVATION_SINISTRE"
       FROM sinistre
       WHERE "LIB_PRODUIT" IN (${placeholders})`,
      produits,
    );
  }
}
