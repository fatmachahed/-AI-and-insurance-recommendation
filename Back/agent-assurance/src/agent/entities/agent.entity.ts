
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('agent')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  login: string;

  @Column()
  password: string;
}
