// Fonction Netlify serverless pour appeler l'API Anthropic
// Version améliorée avec tous les critères de compétences

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { transcript } = JSON.parse(event.body);

    if (!transcript) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Transcript is required' })
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: `Tu es un assistant expert pour analyser les journées de stage en physiothérapie. Analyse la transcription suivante et extrais les informations structurées pour remplir 3 documents:

=== 1. JOURNAL RÉFLEXIF ===
Extrais 1 à 2 entrées par journée décrite. Pour chaque entrée:
- activite: Ce que l'étudiant a fait (activités d'apprentissage)
- appris: Ce qu'il a appris (connaissances, attitudes, habiletés)
- difficultes: Difficultés rencontrées
- orientation: Vers quoi il oriente ses apprentissages
- reflexions: Réflexions et questions
- competences: Array des compétences concernées parmi: ["Communication", "Collaboration", "Professionnalisme", "Expertise", "Leadership", "Érudition", "Gestion"]

=== 2. CAS CLINIQUES ===
Pour CHAQUE patient mentionné, extrais:
- diagnostic: Diagnostic ou raison de consultation
- age: Âge du patient (texte)
- evaluation_o: Boolean (a observé le cas)
- evaluation_em_initiale: Boolean (évaluation initiale avec moniteur)
- evaluation_em_reevaluation: Boolean (réévaluation avec moniteur)
- evaluation_em_conge: Boolean (évaluation au congé avec moniteur)
- evaluation_es_initiale: Boolean (évaluation initiale seul)
- evaluation_es_reevaluation: Boolean (réévaluation seul)
- evaluation_es_conge: Boolean (évaluation au congé seul)
- traitement_tm: Boolean (traitement avec moniteur)
- traitement_ts: Boolean (traitement seul)
- conditions_cr: Boolean (conditions cardio-respiratoires présentes)
- informations_complementaires: Résumé du cas
- details_competences: Texte détaillé de TOUT ce qui a été fait avec le patient

=== 3. COMPÉTENCES (CAHIER D'EXPÉRIENCE) ===

**A) COMPÉTENCES TRANSVERSALES:**
Identifie toutes les compétences transversales utilisées parmi:

COMMUNICATION:
- Rédaction d'une anamnèse
- Rédaction de dossiers (SOAPIÉ)
- Résumé de dossiers
- Correspondance (lettres aux médecins)
- Rapport aux organismes payeurs (SAAQ, CSST)
- Rédaction d'un programme d'exercices

GESTION:
- Planification d'horaire
- Formulaire pour vignette automobile
- Formulaire pour demande d'aides techniques à la marche
- Formulaire de référence interétablissement
- Compilation d'indicateurs
- Sensibilisation à la gestion

PROMOTION DE LA SANTÉ:
- Enseignement (famille, professionnels, autres)
- Rédaction de programmes d'exercices à domicile

COLLABORATION:
- Participation à des réunions (interdisciplinaires, famille)
- Participation à l'élaboration d'un PII
- Consultation auprès d'autres professionnels

ÉRUDITION:
- Exposés cliniques
- Sensibilisation à la recherche clinique
- Considère les données probantes
- Participation à des réunions scientifiques
- Visionnement de vidéo, écoute de cassettes audio

Pour chaque compétence transversale trouvée, retourne:
{
  "categorie": "communication" | "gestion" | "promotion" | "collaboration" | "érudition",
  "sous_categorie": "Rédaction d'une anamnèse" (exemple),
  "experience": "Description de ce qui a été fait",
  "niveau_autonomie": "avec_encadrement" | "seul"
}

**B) COMPÉTENCES EXPERTISE:**
Identifie TOUTES les compétences d'expertise utilisées parmi ces critères:

MÉTHODES D'ÉVALUATION:

Bilan musculosquelettique:
- Observations générales (longueur MI, atrophie, etc.)
- Examen postural global (debout, assis, couché)
- Examen postural détaillé
- Bilan articulaire Rachis (actif, passif, physiologique et résistance isométrique)
- Bilan articulaire MS
- Bilan articulaire MI
- Mouvements accessoires Rachis
- Mouvements accessoires MS
- Mouvements accessoires MI
- Mobilité neurale Rachis
- Mobilité neurale MS
- Mobilité neurale MI
- Mouvements fonctionnels Rachis
- Mouvements fonctionnels MS
- Mouvements fonctionnels MI
- Bilan musculaire Rachis
- Bilan musculaire MS
- Bilan musculaire MI
- Palpation Rachis
- Palpation MS
- Palpation MI
- Tests spécifiques Rachis
- Tests spécifiques MS
- Tests spécifiques MI
- Tests de stabilité
- Tests d'artère

Bilan neurologique:
- Développement moteur en pédiatrie
- Réactions posturales et d'équilibre en pédiatrie
- Tonus musculaire
- Fonction motrice globale
- Contrôle postural
- Contrôle oculomoteur
- Somesthésie (sensibilité superficielle et profonde)
- Myotomes / dermatomes
- Réflexes normaux
- Réflexes pathologiques
- Réflexes primitifs
- Coordination
- Évaluation Chedoke McMaster
- Évaluation Fugl-Meyer
- MIF
- Tests spécifiques en pédiatrie AIMS
- Tests spécifiques en pédiatrie MAI
- Tests spécifiques en pédiatrie GMFM
- Tests spécifiques en pédiatrie TIME
- Tests spécifiques en pédiatrie Peabody

Bilan cardiorespiratoire:
- Auscultation
- Signes vitaux (FC, TA)
- Échelle de Borg
- Saturation
- Toux / Expectoration
- Schème respiratoire et mobilité thoracique
- Mesures objectives (Inspirométrie, fréquence respiratoire, échelle de dyspnée)
- Palpation (cage thoracique, muscles accessoires, pouls périphériques)
- Tests complémentaires (percussion)

Bilan circulatoire:
- Mesure œdème
- Observation de la peau (coloration, température)
- Plaie / cicatrice

Bilan du rendement fonctionnel:
- Transferts
- AVQ
- Contention
- Équilibre assis
- Équilibre debout
- Échelle de Berg
- TUG
- Foam and dome
- GEM
- SMAF
- Test de 6 minutes
- Analyse de la marche avec aide ambulatoire
- Analyse de la marche sans aide ambulatoire
- Analyse de la marche escaliers
- Relever du sol
- Endurance à l'effort

Évaluation de la douleur:
- EVA (échelle visuelle analogue)
- Questionnaire McGill sur la douleur
- Échelle des visages
- Échelle Dolopus
- Geriatric pain measure

MODALITÉS DE TRAITEMENT:

Électrothérapie:
- Ondes courtes
- Ultrasons
- Stimulation transdermales (TENS thérapie de la douleur)
- Courants continus constants iontophorèse
- Courants Interférentiels
- Courants stimulo-moteurs
- Électrodiagnostic
- Laser
- Rétroaction biologique
- Micro-courants
- Courants russes

Hydrothérapie, cryothérapie:
- Piscine
- Bain tourbillon
- Cryothérapie
- Bain de paraffine
- Fomentations chaudes

Kinésithérapie:
- Technique de tissus mous (massage)
- Frictions Cyriax
- Bandages
- Traction cervicale manuelle
- Traction cervicale mécanique
- Traction lombaire manuelle
- Traction lombaire mécanique
- Mouvement passif continu mécanique (CPM)
- Mouvements passifs
- Exercices aidés
- Exercices libres
- Exercices contrariés (résistés) manuels
- Exercices d'assouplissement
- Exercices contrariés (résistés) mécaniques
- Bandes élastiques
- Poids libres
- Isocinétique (biodex)
- Exercices chaîne fermée
- Exercices en suspension
- Exercices de relaxation
- Mobilisations articulaires
- Mobilité neurale
- Exercices d'équilibre
- Taping
- Exercices posturaux
- Positionnement
- Exercices de coordination
- Exercices d'endurance
- Exercices fonctionnels
- Exercices respiratoires
- Drainage postural
- Mobilité thoracique
- Techniques de vibration / compression thoracique
- Technique de la thérapie avec pression expiratoire positive
- Rééducation à la marche libre
- Rééducation à la marche avec aide ambulatoire
- Techniques de déplacement d'un client (transferts)
- Réentraînement aux escaliers
- Classes d'exercices
- Entrainement à l'exercice
- Inhibition / facilitation tonus musculaire
- Exercices de contrôle postural
- Facilitation du mouvement
- Exercices de contrôle moteur
- Stimulations proprioceptives
- Exercices de développement moteur
- PNF
- Rééducation périnéale
- Traitement des plaies et brûlures
- Rééducation vestibulaire
- Approche pré et post natale

ANALYSE ET PLANIFICATION:
- Tient compte des incidences pharmacologiques des médicaments
- Tient compte des résultats des tests diagnostiques et médicaux (échographie, ECG, IRM, scan)
- Tient compte des précautions et contre-indications spécifiques à la condition du patient
- Tient compte des antécédents médicaux du patient
- Établit un diagnostic physiothérapique
- Établit un PID (Plan d'Intervention Disciplinaire)

AIDES TECHNIQUES:
- Attelles
- Corsets
- Orthèses
- Prothèses
- Aide ambulatoire
- Vêtements à pression (Jobst)
- Positionnement
- Bas compressifs

Pour chaque compétence expertise trouvée, retourne:
{
  "type_principal": "methodes_evaluation" | "modalites_traitement" | "analyse_planification" | "aides_techniques",
  "sous_type": "bilan_musculosquelettique" | "bilan_neurologique" | "bilan_cardiorespiratoire" | "bilan_circulatoire" | "bilan_rendement_fonctionnel" | "evaluation_douleur" | "electrotherapie" | "hydrothérapie_cryotherapie" | "kinesiotherapie" | "analyse_planification" | "aides_techniques",
  "critere": "Nom exact du critère utilisé (ex: Bilan articulaire MS, TENS, Exercices d'équilibre)",
  "experience": "Description de ce qui a été fait",
  "niveau_autonomie": "observer" | "evaluer_avec_encadrement" | "evaluer_seul" | "traiter_avec_encadrement" | "traiter_seul"
}

**IMPORTANT:**
- Identifie TOUS les critères mentionnés, même indirectement
- Si l'étudiant dit "j'ai fait l'évaluation complète", déduis les critères standards (amplitude, force, palpation, etc.)
- Si "électrothérapie TENS" → critere: "Stimulation transdermales (TENS thérapie de la douleur)"
- Si "exercices de renforcement" → critere: "Exercices contrariés (résistés) manuels" ou "Exercices contrariés (résistés) mécaniques"

TRANSCRIPTION À ANALYSER:
"""
${transcript}
"""

RÉPONDS UNIQUEMENT EN JSON VALIDE (pas de texte avant/après):
{
  "journal": [
    {
      "activite": "...",
      "appris": "...",
      "difficultes": "...",
      "orientation": "...",
      "reflexions": "...",
      "competences": ["Communication", "Expertise"]
    }
  ],
  "cas": [
    {
      "diagnostic": "Fracture du tibia",
      "age": "65",
      "evaluation_o": false,
      "evaluation_em_initiale": true,
      "evaluation_em_reevaluation": false,
      "evaluation_em_conge": false,
      "evaluation_es_initiale": false,
      "evaluation_es_reevaluation": false,
      "evaluation_es_conge": false,
      "traitement_tm": true,
      "traitement_ts": false,
      "conditions_cr": true,
      "informations_complementaires": "Hypertension, surveillance PA",
      "details_competences": "Évaluation amplitude articulaire, force musculaire, douleur EVA, application TENS 80Hz 20min, surveillance PA"
    }
  ],
  "competences": {
    "transversales": [
      {
        "categorie": "communication",
        "sous_categorie": "Rédaction de dossiers (SOAPIÉ)",
        "experience": "Rédaction du dossier patient",
        "niveau_autonomie": "seul"
      }
    ],
    "expertise": [
      {
        "type_principal": "methodes_evaluation",
        "sous_type": "bilan_musculosquelettique",
        "critere": "Bilan articulaire MI",
        "experience": "Évaluation amplitude articulaire membre inférieur",
        "niveau_autonomie": "evaluer_avec_encadrement"
      },
      {
        "type_principal": "modalites_traitement",
        "sous_type": "electrotherapie",
        "critere": "Stimulation transdermales (TENS thérapie de la douleur)",
        "experience": "Application TENS 80 hertz 20 minutes",
        "niveau_autonomie": "traiter_avec_encadrement"
      }
    ]
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
