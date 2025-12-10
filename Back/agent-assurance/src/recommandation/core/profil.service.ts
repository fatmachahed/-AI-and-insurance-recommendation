import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfilService {
  constructor(private dataSource: DataSource) {}

  async getClientPhysiques() {
    return this.dataSource.query(
      `SELECT ref_personne, date_naissance, lib_profession, situation_familiale, lib_secteur_activite
       FROM clients_physiques`,
    );
  }

  async getClientMoraux() {
    return this.dataSource.query(
      `SELECT ref_personne, raison_sociale, matricule_fiscale, lib_activite
       FROM clients_morales`,
    );
  }
}
