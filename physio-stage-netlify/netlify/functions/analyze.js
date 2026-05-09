// Fonction Netlify serverless pour appeler l'API Anthropic
// Évite les problèmes CORS

exports.handler = async (event, context) => {
  // Permettre CORS depuis n'importe quel domaine
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Gérer les requêtes OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parser le body de la requête
    const { transcript } = JSON.parse(event.body);

    if (!transcript) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Transcript is required' })
      };
    }

    // Appeler l'API Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Tu es un assistant pour un stagiaire en physiothérapie. Analyse la transcription suivante de sa journée et extrais les informations structurées pour remplir 3 documents:

1. JOURNAL RÉFLEXIF (doit contenir 2 activités par jour):
   - Ce que j'ai fait (activités d'apprentissage)
   - Ce que j'ai appris (connaissances, attitudes, habiletés)
   - Ce que j'ai rencontré comme difficultés
   - Ce vers quoi j'oriente mes apprentissages
   - Réflexions/questions
   - Compétence(s) concernée(s): Communication, Leadership, Collaboration, Érudition, Professionnalisme, Gestion, Expertise

2. CAS CLINIQUES:
   - Diagnostic ou raison de consultation
   - Âge du patient
   - Évaluations: O (Observer), EM (Évaluer avec Moniteur), ES (Évaluer Seul), TM (Traiter avec Moniteur), TS (Traiter Seul)
   - Présence de conditions cardio-respiratoires (CR): oui/non
   - Informations complémentaires

3. COMPÉTENCES:
   - Compétences transversales (Communication, Gestion, etc.)
   - Compétences expertise (Évaluation, Traitement)
   - Niveau d'autonomie

Transcription:
"${transcript}"

Réponds UNIQUEMENT en JSON:
{
  "journal": [{"activite": "...", "appris": "...", "difficultes": "...", "orientation": "...", "reflexions": "...", "competences": ["..."]}],
  "cas": [{"diagnostic": "...", "age": "...", "evaluation_o": false, "evaluation_em": true, "evaluation_es": false, "traitement_tm": true, "traitement_ts": false, "conditions_cr": true, "informations_complementaires": "..."}],
  "competences": {
    "transversales": [{"categorie": "communication", "experience": "...", "niveau_autonomie": "seul", "nb_fois": 1}],
    "expertise": [{"type": "evaluation", "sous_categorie": "bilan_musculosquelettique", "experience": "...", "niveau_autonomie": "observer", "nb_cas": "A"}]
  }
}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
