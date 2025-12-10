import { Module } from '@nestjs/common';
import { RecommandationService } from './recommandation.service';
import { RecommandationController } from './recommandation.controller';
import { ProfilService } from './core/profil.service';
import { ContratsService } from './core/contrats.service';
import { RulesEngineService } from './core/rules-engine.service';
import { LlmService } from './llm/llm.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [RecommandationController],
  providers: [
    RecommandationService,
    ProfilService,
    ContratsService,
    RulesEngineService,
    LlmService,
    MailService,
  ],
  exports: [RecommandationService],
})
export class RecommandationModule {}
