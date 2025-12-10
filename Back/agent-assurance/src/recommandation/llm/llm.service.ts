import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class LlmService {
  async generateArgumentaire(client: any, produit: string): Promise<string> {
    console.log('📋 Client reçu:', client);
    console.log('📦 Produit reçu:', produit);

    const nomPrenom = client.nom_prenom || 'Client';
    const age = this.calculateAge(client.date_naissance);
    const ville = client.ville || '';
    const profession = client.lib_profession || '';
    const situationFamiliale = client.situation_familiale || '';

    const prompt = this.buildPrompt(nomPrenom, age, ville, profession, situationFamiliale, produit);

    try {
      const argumentaire = await this.callPythonLLM(prompt);
      return argumentaire;
    } catch (error) {
      console.error('❌ Erreur LLM Python:', error);
      return this.generateFallbackMessage(nomPrenom, age, ville, profession, produit);
    }
  }

  private buildPrompt(
    nomPrenom: string, 
    age: number, 
    ville: string, 
    profession: string, 
    situationFamiliale: string, 
    produit: string
  ): string {
    return `Tu es un conseiller commercial expert en assurance. 
Rédige un email professionnel et persuasif pour proposer le produit ${produit} à ${nomPrenom}.

Informations sur le client:
- Nom: ${nomPrenom}
- Âge: ${age} ans
- Ville: ${ville}
- Profession: ${profession}
- Situation familiale: ${situationFamiliale}
- Produit recommandé: ${produit}

L'email doit être:
1. Personnalisé et chaleureux
2. Mettre en avant les bénéfices du produit
3. Adapté au profil du client
4. Professionnel mais accessible
5. Avec un appel à l'action clair

Email:`; 
  }

  private async callPythonLLM(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
     
     
     
     const scriptPath = path.join(__dirname, '..', '..', '..', 'src', 'recommandation', 'llm', 'tinyllama.py');



      console.log(`🔧 Exécution du script: ${scriptPath}`);
      
      const pythonProcess = spawn('python', [scriptPath, JSON.stringify({ prompt })]);

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        console.log(`🐍 Script terminé avec code: ${code}`);
        if (code === 0) {
          try {
            const parsed = JSON.parse(result);
            if (parsed.response) {
              resolve(parsed.response);
            } else if (parsed.error) {
              reject(parsed.error);
            } else {
              reject("Format de sortie Python invalide");
            }
          } catch (e) {
            reject(`Erreur de parsing JSON: ${e}`);
          }
        } else {
          reject(`Script Python échoué avec code ${code}: ${errorOutput}`);
        }
      });

      pythonProcess.on('error', (error) => {
        reject(`Erreur d'exécution: ${error.message}`);
      });

      setTimeout(() => {
        pythonProcess.kill();
        reject('Timeout: Le script Python a pris trop de temps (120s)');
      }, 120000);
    });
  }

  private generateFallbackMessage(
    nomPrenom: string, 
    age: number, 
    ville: string, 
    profession: string, 
    produit: string
  ): string {
    return `Cher ${nomPrenom},

En tant que conseiller de votre agence assurance, je me permets de vous contacter aujourd'hui concernant une opportunité qui pourrait vous intéresser.

En analysant votre profil (${age} ans, ${ville}${profession ? ', ' + profession : ''}), j'ai identifié que notre produit **${produit}** correspond parfaitement à vos besoins.

Cette solution vous offrira :
- Une protection adaptée à votre situation
- Des garanties complètes et personnalisables
- Des conditions avantageuses spécialement pour vous

Je reste à votre disposition pour échanger plus en détail et répondre à toutes vos questions.

Cordialement,
Votre conseiller assurance`;
  }

  private calculateAge(dateNaissance: string): number {
    if (!dateNaissance) return 0;
    
    try {
      const birthDate = new Date(dateNaissance);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  }
}
