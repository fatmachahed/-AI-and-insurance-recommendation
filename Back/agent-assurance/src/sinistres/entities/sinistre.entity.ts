// src/sinistres/entities/sinistre.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sinistre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  NUM_SINISTRE: string;

  @Column({ nullable: true })
  NUM_CONTRAT: string;

  @Column({ nullable: true })
  LIB_BRANCHE: string;

  @Column({ nullable: true })
  LIB_SOUS_BRANCHE: string;

  @Column({ nullable: true })
  LIB_PRODUIT: string;

  @Column({ nullable: true })
  NATURE_SINISTRE: string;

  @Column({ nullable: true })
  LIB_TYPE_SINISTRE: string;

  @Column({ type: 'decimal', nullable: true })
  TAUX_RESPONSABILITE: number;

  @Column({ type: 'date', nullable: true })
  DATE_SURVENANCE: string;

  @Column({ type: 'date', nullable: true })
  DATE_DECLARATION: string;

  @Column({ type: 'date', nullable: true })
  DATE_OUVERTURE: string;

  @Column({ nullable: true })
  OBSERVATION_SINISTRE: string;

  @Column({ nullable: true })
  LIB_ETAT_SINISTRE: string;

  @Column({ nullable: true })
  LIEU_ACCIDENT: string;

  @Column({ nullable: true })
  MOTIF_REOUVERTURE: string;

  @Column({ type: 'decimal', nullable: true })
  MONTANT_ENCAISSE: number;

  @Column({ type: 'decimal', nullable: true })
  MONTANT_A_ENCAISSER: number;
}
