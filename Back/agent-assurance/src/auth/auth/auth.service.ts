import { Injectable } from '@nestjs/common';
import { AgentService } from '../../agent/agent.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly agentService: AgentService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAgent(login: string, pass: string): Promise<any> {
    const agent = await this.agentService.findOneByLogin(login);
    if (agent && (await bcrypt.compare(pass, agent.password))) {
      const { password, ...result } = agent;
      return result;
    }
    return null;
  }

  async login(agent: any) {
    const payload = { login: agent.login, sub: agent.id };
    return {
      access_token: this.jwtService.sign(payload),
      name: agent.login,
    };
  }

 
}