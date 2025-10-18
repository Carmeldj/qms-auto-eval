import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Assessment, Answer } from '../types';
import { principles } from '../data/principles';

type AssessmentContextType = {
  currentAssessment: Assessment | null;
  startNewAssessment: () => void;
  updateAnswer: (principleId: string, score: number, comment?: string) => void;
  calculateScores: () => Assessment | undefined;
  getAnswer: (principleId: string) => Answer | undefined;
  clearAssessment: () => void;
};

const KEY = 'pharma_currentAssessment_v1';

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessmentContext = (): AssessmentContextType => {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessmentContext must be used within an AssessmentProvider');
  return ctx;
};

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) as Assessment : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentAssessment) {
      localStorage.setItem(KEY, JSON.stringify(currentAssessment));
    } else {
      localStorage.removeItem(KEY);
    }
  }, [currentAssessment]);

  const startNewAssessment = () => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      answers: [],
      scores: { principles: {}, pmqs: {}, overall: 0 }
    };
    setCurrentAssessment(newAssessment);
  };

  const updateAnswer = (principleId: string, score: number, comment?: string) => {
    if (!currentAssessment) return;
    const idx = currentAssessment.answers.findIndex(a => a.principleId === principleId);
    const answer = { principleId, score, comment };
    const answers = idx >= 0
      ? currentAssessment.answers.map((a, i) => i === idx ? answer : a)
      : [...currentAssessment.answers, answer];

    setCurrentAssessment({ ...currentAssessment, answers });
  };

  const calculateScores = (): Assessment | undefined => {
    if (!currentAssessment) return;
    const principleScores: Record<string, number> = {};
    currentAssessment.answers.forEach(a => {
      principleScores[a.principleId] = a.score;
    });

    const pmqScores: Record<number, number> = {};
    for (let pmq = 1; pmq <= 7; pmq++) {
      const pmqPrinciples = principles.filter(p => p.pmq === pmq);
      const pmqAnswers = currentAssessment.answers.filter(a =>
        pmqPrinciples.some(p => p.id === a.principleId)
      );
      if (pmqAnswers.length > 0) {
        const total = pmqAnswers.reduce((s, an) => s + an.score, 0);
        pmqScores[pmq] = total / pmqAnswers.length;
      }
    }

    const overall = Object.values(pmqScores).length ? (Object.values(pmqScores).reduce((s, v) => s + v, 0) / Object.values(pmqScores).length) : 0;
    const updated = { ...currentAssessment, scores: { principles: principleScores, pmqs: pmqScores, overall } };
    setCurrentAssessment(updated);
    return updated;
  };

  const getAnswer = (principleId: string) => currentAssessment?.answers.find(a => a.principleId === principleId);

  const clearAssessment = () => setCurrentAssessment(null);
  
  return (
    <AssessmentContext.Provider value={{ currentAssessment, startNewAssessment, updateAnswer, calculateScores, getAnswer, clearAssessment }}>
      {children}
    </AssessmentContext.Provider>
  );
};