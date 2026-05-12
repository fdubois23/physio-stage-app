# Assistant de Stage Physiothérapie

Application web pour documenter votre stage en physiothérapie avec enregistrement vocal/texte et analyse automatique par IA.

## 🚀 Déploiement sur Netlify

### Prérequis
- Compte Netlify (gratuit): https://app.netlify.com/signup
- Clé API Anthropic: https://console.anthropic.com/

### Étapes de déploiement

#### 1. Préparer les fichiers

Votre projet doit contenir:
```
projet/
├── index.html                    (l'application)
├── netlify.toml                  (configuration Netlify)
└── netlify/
    └── functions/
        └── analyze.js            (fonction serverless)
```

#### 2. Déployer sur Netlify

**Option A: Via l'interface web (recommandé)**

1. Allez sur https://app.netlify.com
2. Cliquez sur "Add new site" → "Deploy manually"
3. Glissez-déposez le DOSSIER complet du projet
4. Attendez le déploiement (1-2 min)

**Option B: Via Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### 3. Configurer la clé API Anthropic

1. Dans Netlify Dashboard → Votre site
2. "Site settings" → "Environment variables"
3. Ajoutez une nouvelle variable:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (votre clé Anthropic)
4. Sauvegardez

#### 4. Redéployer

Après avoir ajouté la variable d'environnement:
1. "Deploys" → "Trigger deploy" → "Deploy site"
2. Attendez la fin du déploiement

#### 5. Utiliser l'application

1. Ouvrez le lien fourni par Netlify (ex: `https://votre-app.netlify.app`)
2. Créez votre compte
3. Commencez à documenter votre stage!

## 🔑 Obtenir une clé API Anthropic

1. Allez sur https://console.anthropic.com
2. Créez un compte (carte de crédit requise mais crédit gratuit de 5$)
3. "API Keys" → "Create Key"
4. Copiez la clé (elle commence par `sk-ant-api03-`)

**Coût:** ~$0.003 par analyse (3 dixièmes de cent)

## 🔧 Configuration Supabase

La base de données est déjà configurée. Les identifiants sont dans le code.

Pour utiliser votre propre instance Supabase:

1. Créez un projet sur https://supabase.com
2. Exécutez le script SQL fourni (`supabase_setup.sql`)
3. Remplacez dans `index.html`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## 📱 Fonctionnalités

- ✅ Enregistrement vocal (Chrome/Edge) ou saisie texte
- ✅ Analyse automatique par Claude
- ✅ 3 documents générés: Journal réflexif, Cas cliniques, Cahier d'expérience
- ✅ Synchronisation cloud (Supabase)
- ✅ Multi-appareil
- ✅ Export Excel
- ✅ Authentification sécurisée

## 🆘 Dépannage

### "Erreur d'analyse"
- Vérifiez que la variable `ANTHROPIC_API_KEY` est bien configurée
- Vérifiez que vous avez des crédits Anthropic restants

### "Erreur Supabase"
- Vérifiez que le script SQL a été exécuté
- Vérifiez les identifiants Supabase dans le code

### "Fonction non trouvée"
- Assurez-vous que le dossier `netlify/functions` est bien uploadé
- Vérifiez que `netlify.toml` est à la racine du projet

## 📄 Licence

Usage personnel pour stage en physiothérapie.
