import { Injectable } from '@nestjs/common';
import { ProfilService } from './core/profil.service';
import { ContratsService } from './core/contrats.service';
import { RulesEngineService } from './core/rules-engine.service';
import { LlmService } from './llm/llm.service';
import { MailService } from '../mail/mail.service';
import { DataSource } from 'typeorm';

@Injectable()
export class RecommandationService {
  constructor(
    private profilService: ProfilService,
    private contratsService: ContratsService,
    private rulesEngine: RulesEngineService,
    private llmService: LlmService,
    private mailService: MailService,
    private dataSource: DataSource,
  ) {}

  private calculateAge(dateStr: string | null): number {
    if (!dateStr) return 0;
    const birthDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async generateRecommendations() {
    const clientsPhysiques = await this.profilService.getClientPhysiques();
    const clientsMoraux = await this.profilService.getClientMoraux();

    const allClients = [
      ...clientsPhysiques.map((c) => ({ ...c, type_client: 'physique' })),
      ...clientsMoraux.map((c) => ({ ...c, type_client: 'morale' })),
    ];

    for (const client of allClients) {
      const age =
        client.type_client === 'physique'
          ? this.calculateAge(client.date_naissance)
          : this.calculateAge(client.date_creation);

      const contrats = await this.contratsService.getContratsByClient(client.ref_personne);
      const produitsExistants = contrats.map((c: any) => c.LIB_PRODUIT);
      const sinistres = await this.contratsService.getSinistresByProduits(produitsExistants);

      const data = {
        ...client,
        age,
        produits_existants: produitsExistants,
        contrats,
        sinistres,
      };

      const recommandations = this.rulesEngine.applyRules(data);

      for (const rec of recommandations) {
        if (!produitsExistants.includes(rec.produit)) {
          const argumentaire = await this.llmService.generateArgumentaire(data, rec.produit);

          await this.dataSource.query(
            `INSERT INTO opportunite ("REF_PERSONNE", "PRODUIT_REC", "ARGUMENTATIVE", "STATUT")
             VALUES ($1, $2, $3, 'Proposé')`,
            [client.ref_personne, rec.produit, argumentaire],
          );
          console.log(`✅ Recommandation générée avec succès pour le client : ${client.ref_personne}, produit : ${rec.produit}`);


          // 🚀 Envoi email
          // await this.mailService.sendRecommendationEmail(
          //   "client@email.com", // à remplacer par le vrai mail client
          //   rec.produit,
          //   argumentaire,
          // );
        }
      }
    }

    return 'Recommandations générées avec succès';
  }
}
