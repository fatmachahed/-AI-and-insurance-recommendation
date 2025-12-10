import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';
import { ClientMorale } from './clients-morales/entities/clients-morale.entity';
import { ClientPhysique } from './clients-physiques/entities/clients-physique.entity';
import { Contrat } from './contrats/entities/contrat.entity';
import { Sinistre } from './sinistres/entities/sinistre.entity';
import { MappingProduit } from './mapping-produit/entities/mapping-produit.entity';
import { Opportunite } from './opportunites/entities/opportunite.entity';
import { Historique } from './historique/entities/historique.entity';
import { ContratsModule } from './contrats/contrats.module';
import { SinistresModule } from './sinistres/sinistres.module';
import { ClientsPhysiquesModule } from './clients-physiques/clients-physiques.module';
import { ClientsMoralesModule } from './clients-morales/clients-morales.module';
import { HistoriqueModule } from './historique/historique.module';
import { MappingProduitModule } from './mapping-produit/mapping-produit.module';
import { OpportunitesModule } from './opportunites/opportunites.module';
import { AgentModule } from './agent/agent.module';
import { SeedService } from './seed/seed.service';
import { Agent } from './agent/entities/agent.entity';
import { AuthModule } from './auth/auth/auth.module';
import { RecommandationModule } from './recommandation/recommandation.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [
    // Charge automatiquement les variables .env
    ConfigModule.forRoot({ isGlobal: true }),
    // Config TypeORM avec variables d'environnement
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          ClientMorale,
          ClientPhysique,
          Contrat,
          Sinistre,
          MappingProduit,
          Opportunite,
          Historique,
          Agent
        ],
        synchronize: true, // true seulement en dev
        logging: true, // Active les logs SQL (optionnel)
      }),
    }),
    ClientsModule,
    ContratsModule,
    SinistresModule,
    ClientsPhysiquesModule,
    ClientsMoralesModule,
    HistoriqueModule,
    MappingProduitModule,
    OpportunitesModule,
    AgentModule,
    AuthModule,
    RecommandationModule,
    MailModule,
  ],
  providers: [SeedService],
})
export class AppModule {}