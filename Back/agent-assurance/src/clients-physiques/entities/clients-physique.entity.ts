import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients_physiques')
export class ClientPhysique {
  @PrimaryColumn({ length: 191 })
  ref_personne: string;

  @Column()
  nom_prenom: string;

  @Column({ type: 'date', nullable: true })
  date_naissance: string;


  @Column({ nullable: true })
  lieu_naissance: string;

  @Column({ nullable: true })
  code_sexe: string;

  @Column({ nullable: true })
  situation_familiale: string;

  @Column({ nullable: true })
  num_piece_identite: string;

  @Column({ nullable: true })
  lib_secteur_activite: string;

  @Column({ nullable: true })
  lib_profession: string;

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
