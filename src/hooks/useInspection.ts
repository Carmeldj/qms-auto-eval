import { useState } from 'react';
import { InspectionReport, PharmacyInfo, PharmacistInfo, InspectionAnswer } from '../types/inspection';
import { inspectionItems } from '../data/inspectionItems';

export const useInspection = () => {
  const [currentInspection, setCurrentInspection] = useState<InspectionReport | null>(null);

  const startNewInspection = (pharmacyInfo: PharmacyInfo, pharmacistInfo: PharmacistInfo) => {
    const newInspection: InspectionReport = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      pharmacyInfo,
      pharmacistInfo,
      answers: [],
      summary: {
        totalItems: inspectionItems.length,
        compliant: 0,
        nonCompliant: 0,
        notApplicable: 0,
        criticalGaps: 0,
        majorGaps: 0,
        minorGaps: 0
      }
    };
    setCurrentInspection(newInspection);
  };

  const updateAnswer = (itemId: string, status: 'compliant' | 'non-compliant' | 'not-applicable', comment?: string, gapType?: 'critical' | 'major' | 'minor') => {
    if (!currentInspection) return;

    const existingAnswerIndex = currentInspection.answers.findIndex(
      a => a.itemId === itemId
    );

    const newAnswer: InspectionAnswer = { itemId, status, comment, gapType };

    let updatedAnswers;
    if (existingAnswerIndex >= 0) {
      updatedAnswers = [...currentInspection.answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers = [...currentInspection.answers, newAnswer];
    }

    const updatedInspection = {
      ...currentInspection,
      answers: updatedAnswers
    };

    setCurrentInspection(updatedInspection);
  };

  const calculateSummary = () => {
    if (!currentInspection) return;

    const summary = {
      totalItems: inspectionItems.length,
      compliant: 0,
      nonCompliant: 0,
      notApplicable: 0,
      criticalGaps: 0,
      majorGaps: 0,
      minorGaps: 0
    };

    currentInspection.answers.forEach(answer => {
      switch (answer.status) {
        case 'compliant':
          summary.compliant++;
          break;
        case 'non-compliant':
          summary.nonCompliant++;
          if (answer.gapType === 'critical') summary.criticalGaps++;
          else if (answer.gapType === 'major') summary.majorGaps++;
          else if (answer.gapType === 'minor') summary.minorGaps++;
          break;
        case 'not-applicable':
          summary.notApplicable++;
          break;
      }
    });

    const updatedInspection = {
      ...currentInspection,
      summary
    };

    setCurrentInspection(updatedInspection);
    return updatedInspection;
  };

  const getAnswer = (itemId: string): InspectionAnswer | undefined => {
    return currentInspection?.answers.find(a => a.itemId === itemId);
  };

  return {
    currentInspection,
    startNewInspection,
    updateAnswer,
    calculateSummary,
    getAnswer
  };
};