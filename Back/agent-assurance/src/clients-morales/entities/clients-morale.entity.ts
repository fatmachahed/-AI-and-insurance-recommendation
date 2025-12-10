
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients_morales')
export class ClientMorale {
  @PrimaryColumn({ length: 191 })
  ref_personne: string;

  @Column()
  raison_sociale: string;

  @Column({ nullable: true })
  matricule_fiscale: string;

  @Column({ nullable: true })
  lib_secteur_activite: string;

  @Column({ nullable: true })
  lib_activite: string;

  @Column({ nullable: true })
  ville: string;

  @Column({ nullable: true })
  lib_gouvernorat: string;

  @Column({ nullable: true })
  ville_gouvernorat: string;

  @Column({ type: 'integer', default: 0 })
  nombre_opportunites: number;

  @Column({ type: 'boolean', default: false })
  sous_equipe: boolean;

  @Column({ type: 'integer', default: 0 })
  nombre_contrats: number;

  @Column({ type: 'timestamp', nullable: true })
  derniere_evaluation: Date;

  @Column({ type: 'varchar', nullable: true })
  urgence: string;

}
