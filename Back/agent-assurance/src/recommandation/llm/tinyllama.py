from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import sys, json

# Chargement du modèle TinyLlama
model_name = "TheBloke/tiny-llama-1b-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Récupérer le prompt depuis l'argument JSON
prompt = json.loads(sys.argv[1])["prompt"]

inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=200)
result = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(result)
# -*- coding: utf-8 -*-
import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import warnings

# Supprimer les warnings pour une sortie propre
warnings.filterwarnings("ignore")

def load_model():
    """Charge un modèle léger français optimisé pour CPU"""
    try:
        # Modèle léger français (336M paramètres)
        model_name = "microsoft/DialoGPT-small"
        
        # Alternative plus légère si DialoGPT ne fonctionne pas bien
        # model_name = "distilgpt2"  # 82M paramètres
        
        # Charger le tokenizer et le modèle
        tokenizer = AutoTokenizer.from_pretrained(model_name, padding_side='left')
        
        # Ajouter un token de padding si absent
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Charger le modèle avec optimisations CPU
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float32,  # Float32 pour CPU
            device_map=None,  # Pas de GPU
            low_cpu_mem_usage=True
        )
        
        # Mettre le modèle en mode évaluation
        model.eval()
        
        return tokenizer, model
        
    except Exception as e:
        print(json.dumps({"error": f"Erreur chargement modèle: {str(e)}"}, ensure_ascii=False))
        return None, None

def generate_email(tokenizer, model, client_data):
    """Génère un email personnalisé"""
    try:
        nom = client_data.get("nom", "Cher client")
        age = client_data.get("age", "")
        ville = client_data.get("ville", "")
        profession = client_data.get("profession", "")
        situation_familiale = client_data.get("situation", "")
        produit = client_data.get("produit", "notre produit d'assurance")
        
        # Prompt structuré et concis pour un modèle léger
        prompt = (
            f"Email commercial pour {nom}:\n"
            f"Produit: {produit}\n"
            f"Profil: {profession}, {age} ans, {ville}, {situation_familiale}\n\n"
            f"Objet: Découvrez {produit} adapté à votre profil\n\n"
            f"Bonjour {nom},\n\n"
        )
        
        # Tokenization
        inputs = tokenizer.encode(prompt, return_tensors="pt", max_length=512, truncation=True)
        
        # Génération avec paramètres optimisés pour la cohérence
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_new_tokens=200,  # Limite pour éviter la répétition
                min_length=50,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                top_k=50,
                repetition_penalty=1.2,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id,
                early_stopping=True
            )
        
        # Décoder la réponse
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Nettoyer la réponse (enlever le prompt initial)
        email_content = generated_text.replace(prompt, "").strip()
        
        # Si la génération est trop courte, utiliser un template
        if len(email_content) < 50:
            email_content = generate_fallback_email(client_data)
        
        return email_content
        
    except Exception as e:
        return generate_fallback_email(client_data)

def generate_fallback_email(client_data):
    """Template de fallback personnalisé"""
    nom = client_data.get("nom", "Cher client")
    age = client_data.get("age", "")
    ville = client_data.get("ville", "")
    profession = client_data.get("profession", "")
    situation_familiale = client_data.get("situation", "")
    produit = client_data.get("produit", "notre produit d'assurance")
    
    # Personnalisation basique selon le profil
    benefits = []
    if "famille" in situation_familiale.lower() or "marié" in situation_familiale.lower():
        benefits.append("protection optimale pour votre famille")
    if profession:
        benefits.append(f"solution adaptée aux {profession.lower()}s")
    if ville:
        benefits.append(f"service disponible à {ville}")
    if age and age.isdigit() and int(age) > 50:
        benefits.append("tranquillité d'esprit pour l'avenir")
    elif age and age.isdigit() and int(age) < 35:
        benefits.append("investissement intelligent pour votre avenir")
    
    benefits_text = ", ".join(benefits[:2]) if benefits else "nombreux avantages"
    
    email = f"""Bonjour {nom},

En tant que {profession} à {ville}, j'ai le plaisir de vous présenter {produit}, spécialement conçu pour répondre à vos besoins.

Notre solution vous offre {benefits_text}, avec des conditions préférentielles adaptées à votre profil.

✓ Devis personnalisé gratuit
✓ Conseiller dédié dans votre région
✓ Tarifs compétitifs

Je vous propose un rendez-vous téléphonique de 15 minutes cette semaine pour vous présenter les détails.

Êtes-vous disponible mardi ou mercredi en fin de journée ?

Cordialement,
Votre conseiller commercial

P.S. : Offre valable jusqu'à la fin du mois."""
    
    return email

def main():
    try:
        # Vérifier argument
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Aucun argument fourni"}))
            return
        
        # Lire les données client
        arg_str = sys.argv[1]
        client_data = json.loads(arg_str)
        
        # Charger le modèle (cache pour éviter de recharger à chaque appel)
        tokenizer, model = load_model()
        
        if tokenizer is None or model is None:
            # Utiliser le fallback si le modèle ne charge pas
            email_content = generate_fallback_email(client_data)
        else:
            # Générer avec le modèle
            email_content = generate_email(tokenizer, model, client_data)
        
        # Retourner le résultat
        print(json.dumps({"response": email_content}, ensure_ascii=False))
        
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Erreur JSON: {str(e)}"}, ensure_ascii=False))
    except Exception as e:
        # Fallback en cas d'erreur
        fallback = generate_fallback_email(json.loads(sys.argv[1]) if len(sys.argv) > 1 else {})
        print(json.dumps({"error": str(e), "response": fallback}, ensure_ascii=False))

if __name__ == "__main__":
    main()
