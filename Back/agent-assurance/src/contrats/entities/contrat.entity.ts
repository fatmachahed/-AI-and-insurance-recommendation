// src/contrats/entities/contrat.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contrat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  REF_PERSONNE: string;

  @Column({ nullable: true })
  NUM_CONTRAT: string;

  @Column({ nullable: true })
  LIB_PRODUIT: string;

  @Column({ type: 'date' , nullable: true })
  EFFET_CONTRAT: string;

  @Column({ type: 'date', nullable: true })
  DATE_EXPIRATION: string;

  @Column({ type: 'date', nullable: true })
  PROCHAIN_TERME: string;

  @Column({ nullable: true })
  LIB_ETAT_CONTRAT: string;

  @Column({ nullable: true })
  BRANCHE: string;

  @Column({ type: 'decimal', nullable: true })
  SOMME_QUITTANCES: number;

  @Column({ nullable: true })
  STATUT_PAIEMENT: string;

  @Column({ type: 'decimal', nullable: true })
  CAPITAL_ASSURE: number;
}




