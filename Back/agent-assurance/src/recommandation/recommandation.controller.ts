import { Controller, Post, Get, Query } from '@nestjs/common';
import { RecommandationService } from './recommandation.service';
import { LlmService } from './llm/llm.service';

@Controller('recommandations')
export class RecommandationController {
  constructor(
    private readonly recommandationService: RecommandationService,
    private readonly llmService: LlmService,
  ) {}

  // POST /recommandations/generate
  @Post('generate')
  async generate() {
    return this.recommandationService.generateRecommendations();
  }

  /**
   * GET /recommandations/llm?client=<JSON>&produit=<string>
   * Génère un argumentaire LLM pour un client et un produit donné
   */
  @Get('llm')
  async generateArgumentaire(
    @Query('client') clientStr: string,
    @Query('produit') produit: string,
  ) {
    try {
      if (!clientStr || !produit) {
        return { error: 'Paramètres client et produit requis' };
      }

      const client = JSON.parse(clientStr); // Convertit le JSON reçu en objet
      const argumentaire = await this.llmService.generateArgumentaire(client, produit);

      return { argumentaire };
    } catch (err) {
      console.error('Erreur génération LLM:', err);
      return { error: 'Impossible de générer l’argumentaire' };
    }
  }
}
