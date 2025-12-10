// src/mapping-produits/entities/mapping-produit.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MappingProduit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  LIB_BRANCHE: string;

  @Column()
  LIB_SOUS_BRANCHE: string;

  @Column()
  LIB_PRODUIT: string;
}
