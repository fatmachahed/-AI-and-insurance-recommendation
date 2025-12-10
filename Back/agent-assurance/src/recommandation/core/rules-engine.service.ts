import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface Recommandation {
  produit: string;
  raison: string;
}

interface Regle {
  condition: string;
  produit: string;
  raison: string;
}

@Injectable()
export class RulesEngineService {
  private regles: Regle[];

  constructor() {
    const filePath = path.join(__dirname, '../../../data/regles_applicables.json');
    this.regles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  applyRules(data: any): Recommandation[] {
    const recommandations: Recommandation[] = [];

    for (const regle of this.regles) {
      try {
        const conditionLambda = eval(regle.condition);

        if (conditionLambda(data)) {
          recommandations.push({
            produit: regle.produit,
            raison: regle.raison,
          });
        }
      } catch (err: any) {
        console.error(`Erreur règle ${regle.produit}:`, err.message);
      }
    }

    return recommandations;
  }
}
