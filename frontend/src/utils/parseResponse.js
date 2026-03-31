export const validateAIResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response: not an object');
  }

  const required = ['resume', 'qcm', 'questions_ouvertes'];
  for (const field of required) {
    if (!response[field]) {
      throw new Error(`Invalid response: missing ${field}`);
    }
  }

  if (!response.resume.introduction || !Array.isArray(response.resume.points_cles) || 
      !Array.isArray(response.resume.definitions) || !response.resume.conclusion) {
    throw new Error('Invalid response: malformed resume structure');
  }

  if (!Array.isArray(response.qcm) || response.qcm.length !== 20) {
    throw new Error('Invalid response: qcm must be an array of 20 items');
  }

  for (const qcm of response.qcm) {
    if (!qcm.id || !qcm.question || !Array.isArray(qcm.options) || 
        qcm.options.length !== 4 || !qcm.reponse || !qcm.explication || !qcm.difficulte) {
      throw new Error('Invalid response: malformed qcm item');
    }
  }

  if (!Array.isArray(response.questions_ouvertes) || response.questions_ouvertes.length !== 10) {
    throw new Error('Invalid response: questions_ouvertes must be an array of 10 items');
  }

  for (const question of response.questions_ouvertes) {
    if (!question.id || !question.question || !question.corrige || !question.difficulte) {
      throw new Error('Invalid response: malformed open question item');
    }
  }

  return true;
};

export const parseAIResponse = (response) => {
  try {
    if (typeof response === 'string') {
      response = JSON.parse(response);
    }
    
    validateAIResponse(response);
    return response;
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

export const sanitizeText = (text) => {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim();
};

export const formatDifficulty = (difficulty) => {
  const map = {
    'facile': 'easy',
    'moyen': 'medium',
    'difficile': 'hard',
    'easy': 'facile',
    'medium': 'moyen',
    'hard': 'difficile'
  };
  return map[difficulty.toLowerCase()] || difficulty;
};
