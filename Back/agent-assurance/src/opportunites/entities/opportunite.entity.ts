// src/opportunites/entities/opportunite.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Opportunite {
  @PrimaryGeneratedColumn()
  ID_OPPORTUNITE: number;

  @Column({ nullable: true })
  REF_PERSONNE: string;

  @Column({ nullable: true })
  PRODUIT_REC: string;

  @Column({ nullable: true })
  ARGUMENTATIVE: string;

  @Column({ nullable: true })
  STATUT: string;
}
