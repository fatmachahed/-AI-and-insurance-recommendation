// src/historique/entities/historique.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Historique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  REF_PERSONNE: string;

  @Column({ type: 'date', nullable: true })
  DATE: string;

  @Column({ nullable: true })
  CANEAU: string;

  @Column({ nullable: true })
  REPONSE: string;
}

