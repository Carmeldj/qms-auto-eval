import { useState } from 'react';
import { Assessment, Answer } from '../types';
import { principles } from '../data/principles';

export const useAssessment = () => {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);

  const startNewAssessment = () => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      answers: [],
      scores: {
        principles: {},
        pmqs: {},
        overall: 0
      }
    };
    setCurrentAssessment(newAssessment);
  };

  const updateAnswer = (principleId: string, score: number, comment?: string) => {
    if (!currentAssessment) return;

    const existingAnswerIndex = currentAssessment.answers.findIndex(
      a => a.principleId === principleId
    );

    const newAnswer: Answer = { principleId, score, comment };

    let updatedAnswers;
    if (existingAnswerIndex >= 0) {
      updatedAnswers = [...currentAssessment.answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers = [...currentAssessment.answers, newAnswer];
    }

    const updatedAssessment = {
      ...currentAssessment,
      answers: updatedAnswers
    };

    setCurrentAssessment(updatedAssessment);
  };

  const calculateScores = () => {
    if (!currentAssessment || currentAssessment.answers.length === 0) return;

    // Calculate principle scores
    const principleScores: Record<string, number> = {};
    currentAssessment.answers.forEach(answer => {
      principleScores[answer.principleId] = answer.score;
    });

    // Calculate PMQ scores
    const pmqScores: Record<number, number> = {};
    for (let pmq = 1; pmq <= 7; pmq++) {
      const pmqPrinciples = principles.filter(p => p.pmq === pmq);
      const pmqAnswers = currentAssessment.answers.filter(a => 
        pmqPrinciples.some(p => p.id === a.principleId)
      );
      
      if (pmqAnswers.length > 0) {
        const totalScore = pmqAnswers.reduce((sum, answer) => sum + answer.score, 0);
        pmqScores[pmq] = totalScore / pmqAnswers.length;
      }
    }

    // Calculate overall score
    const overallScore = Object.values(pmqScores).length > 0 
      ? Object.values(pmqScores).reduce((sum, score) => sum + score, 0) / Object.values(pmqScores).length
      : 0;

    const updatedAssessment = {
      ...currentAssessment,
      scores: {
        principles: principleScores,
        pmqs: pmqScores,
        overall: overallScore
      }
    };

    setCurrentAssessment(updatedAssessment);
    return updatedAssessment;
  };

  const getAnswer = (principleId: string): Answer | undefined => {
    return currentAssessment?.answers.find(a => a.principleId === principleId);
  };

  return {
    currentAssessment,
    startNewAssessment,
    updateAnswer,
    calculateScores,
    getAnswer
  };
};