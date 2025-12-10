
import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class SeedService {
  constructor(private readonly agentService: AgentService) {}

  async seedAdmins() {
    const adminLogins = ['admin1', 'admin2', 'admin3'];
    const commonPassword = 'admin';

    for (const login of adminLogins) {
      const existingAgent = await this.agentService.findOneByLogin(login);
      
      if (!existingAgent) {
        await this.agentService.create(login, commonPassword);
        console.log(`Agent '${login}' créé avec succès.`);
      } else {
        console.log(`L'agent '${login}' existe déjà. Ignoré.`);
      }
    }
  }
}