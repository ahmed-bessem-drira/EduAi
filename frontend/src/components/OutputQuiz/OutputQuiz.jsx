import React, { useState } from 'react';
import { CheckCircle, Eye, EyeOff, Brain, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../ui/Badge';
import styles from './OutputQuiz.module.css';

const OutputQuiz = ({ qcm, openQuestions, language = 'fr' }) => {
  const [activeTab, setActiveTab] = useState('qcm');
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  const [expandedOpenQuestions, setExpandedOpenQuestions] = useState(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userOpenAnswers, setUserOpenAnswers] = useState({});

  const toggleAnswer = (questionId) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(questionId)) {
      newRevealed.delete(questionId);
    } else {
      newRevealed.add(questionId);
    }
    setRevealedAnswers(newRevealed);
  };

  const toggleOpenQuestion = (questionId) => {
    const newExpanded = new Set(expandedOpenQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedOpenQuestions(newExpanded);
  };

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleOpenAnswerChange = (questionId, answer) => {
    setUserOpenAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'facile':
      case 'easy':
        return 'easy';
      case 'moyen':
      case 'medium':
        return 'medium';
      case 'difficile':
      case 'hard':
        return 'hard';
      default:
        return 'medium';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'facile':
      case 'easy':
        return 'Facile';
      case 'moyen':
      case 'medium':
        return 'Moyen';
      case 'difficile':
      case 'hard':
        return 'Difficile';
      default:
        return 'Moyen';
    }
  };

  const getStats = () => {
    const qcmStats = {
      easy: qcm?.filter(q => q.difficulte.toLowerCase() === 'facile' || q.difficulte.toLowerCase() === 'easy').length || 0,
      medium: qcm?.filter(q => q.difficulte.toLowerCase() === 'moyen' || q.difficulte.toLowerCase() === 'medium').length || 0,
      hard: qcm?.filter(q => q.difficulte.toLowerCase() === 'difficile' || q.difficulte.toLowerCase() === 'hard').length || 0,
    };

    const openStats = {
      easy: openQuestions?.filter(q => q.difficulte.toLowerCase() === 'facile' || q.difficulte.toLowerCase() === 'easy').length || 0,
      medium: openQuestions?.filter(q => q.difficulte.toLowerCase() === 'moyen' || q.difficulte.toLowerCase() === 'medium').length || 0,
      hard: openQuestions?.filter(q => q.difficulte.toLowerCase() === 'difficile' || q.difficulte.toLowerCase() === 'hard').length || 0,
    };

    return { qcmStats, openStats };
  };

  if (!qcm && !openQuestions) return null;

  const stats = getStats();

  return (
    <section className={styles.outputQuiz}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Brain className={styles.titleIcon} />
            Quiz Interactif
          </h2>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{qcm?.length || 0}</span>
              <span className={styles.statLabel}>QCM</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{openQuestions?.length || 0}</span>
              <span className={styles.statLabel}>Questions Ouvertes</span>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'qcm' ? styles.active : ''}`}
            onClick={() => setActiveTab('qcm')}
          >
            <CheckCircle className={styles.tabIcon} />
            QCM ({qcm?.length || 0})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'open' ? styles.active : ''}`}
            onClick={() => setActiveTab('open')}
          >
            <MessageCircle className={styles.tabIcon} />
            Questions Ouvertes ({openQuestions?.length || 0})
          </button>
        </div>

        <div className={styles.difficultyStats}>
          <Badge variant="easy">Facile: {stats.qcmStats.easy + stats.openStats.easy}</Badge>
          <Badge variant="medium">Moyen: {stats.qcmStats.medium + stats.openStats.medium}</Badge>
          <Badge variant="hard">Difficile: {stats.qcmStats.hard + stats.openStats.hard}</Badge>
        </div>

        <div className={styles.content}>
          {activeTab === 'qcm' && qcm && (
            <div className={styles.qcmSection}>
              <div className={styles.progress}>
                <span className={styles.progressText}>
                  Question {revealedAnswers.size + 1} / {qcm.length}
                </span>
              </div>

              <div className={styles.questionsList}>
                {qcm.map((question, index) => (
                  <div key={question.id} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                      <div className={styles.questionNumber}>
                        <span>{index + 1}</span>
                      </div>
                      <div className={styles.questionMeta}>
                        <Badge variant={getDifficultyVariant(question.difficulte)}>
                          {getDifficultyLabel(question.difficulte)}
                        </Badge>
                      </div>
                    </div>

                    <h3 className={styles.questionText}>{question.question}</h3>

                    <div className={styles.optionsList}>
                      {question.options.map((option, optIndex) => {
                        const optionLetter = option.charAt(0);
                        const isSelected = selectedAnswers[question.id] === optionLetter;
                        const isCorrect = optionLetter === question.reponse;
                        const isRevealed = revealedAnswers.has(question.id);

                        return (
                          <label
                            key={optIndex}
                            className={`${styles.option} ${isSelected ? styles.selected : ''} ${isRevealed && isCorrect ? styles.correct : ''} ${isRevealed && isSelected && !isCorrect ? styles.incorrect : ''}`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={optionLetter}
                              checked={isSelected}
                              onChange={() => handleOptionSelect(question.id, optionLetter)}
                              disabled={isRevealed}
                            />
                            <span className={styles.optionText}>{option}</span>
                            {isRevealed && isCorrect && <CheckCircle className={styles.correctIcon} />}
                          </label>
                        );
                      })}
                    </div>

                    <button
                      className={styles.revealButton}
                      onClick={() => toggleAnswer(question.id)}
                    >
                      {revealedAnswers.has(question.id) ? (
                        <>
                          <EyeOff className={styles.revealIcon} />
                          Masquer la réponse
                        </>
                      ) : (
                        <>
                          <Eye className={styles.revealIcon} />
                          Voir la réponse
                        </>
                      )}
                    </button>

                    {revealedAnswers.has(question.id) && (
                      <div className={styles.answerExplanation}>
                        <div className={styles.correctAnswer}>
                          <strong>Réponse:</strong> {question.reponse}
                        </div>
                        <div className={styles.explanation}>
                          <strong>Explication:</strong> {question.explication}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'open' && openQuestions && (
            <div className={styles.openSection}>
              <div className={styles.questionsList}>
                {openQuestions.map((question, index) => (
                  <div key={question.id} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                      <div className={styles.questionNumber}>
                        <span>{index + 1}</span>
                      </div>
                      <div className={styles.questionMeta}>
                        <Badge variant={getDifficultyVariant(question.difficulte)}>
                          {getDifficultyLabel(question.difficulte)}
                        </Badge>
                      </div>
                    </div>

                    <h3 className={styles.questionText}>{question.question}</h3>

                    <div className={styles.answerArea}>
                      <textarea
                        className={styles.answerTextarea}
                        placeholder="Écrivez votre réponse ici..."
                        value={userOpenAnswers[question.id] || ''}
                        onChange={(e) => handleOpenAnswerChange(question.id, e.target.value)}
                        rows={4}
                      />
                    </div>

                    <button
                      className={styles.revealButton}
                      onClick={() => toggleOpenQuestion(question.id)}
                    >
                      {expandedOpenQuestions.has(question.id) ? (
                        <>
                          <ChevronUp className={styles.revealIcon} />
                          Masquer le corrigé
                        </>
                      ) : (
                        <>
                          <ChevronDown className={styles.revealIcon} />
                          Voir le corrigé
                        </>
                      )}
                    </button>

                    {expandedOpenQuestions.has(question.id) && (
                      <div className={styles.answerExplanation}>
                        <div className={styles.correctAnswer}>
                          <strong>Corrigé:</strong>
                        </div>
                        <p>{question.corrige}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OutputQuiz;
