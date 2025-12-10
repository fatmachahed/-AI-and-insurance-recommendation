
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async create(login: string, password: string): Promise<Agent> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = this.agentRepository.create({
      login,
      password: hashedPassword,
    });
    return this.agentRepository.save(newAgent);
  }

  async findOneByLogin(login: string): Promise<Agent | undefined> {
    const agent = await this.agentRepository.findOne({ where: { login } });
    return agent === null ? undefined : agent;
  }
}