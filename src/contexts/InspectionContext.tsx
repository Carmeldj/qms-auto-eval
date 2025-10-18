import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { InspectionReport, InspectionAnswer, PharmacyInfo, PharmacistInfo } from '../types';
import { inspectionReportService } from '../services/InspectionReportService';

type DraftInspection = {
    pharmacyInfo: PharmacyInfo | null;
    pharmacistInfo: PharmacistInfo | null;
    answers: InspectionAnswer[];
};

type InspectionContextType = {
    // only keep minimal draft data so InspectionForm can use it directly
    currentInspection: DraftInspection | null;
    startInspection: (initial?: Partial<DraftInspection>) => void;
    updateAnswers: (answers: InspectionAnswer[]) => void;
    updateMeta: (payload: { pharmacy?: PharmacyInfo; pharmacist?: PharmacistInfo }) => void;
    // create final report from draft and return it
    completeInspection: () => InspectionReport | null;
    setInspection: (r: DraftInspection | null) => void;
    clearInspection: () => void;
    completedInspection?: InspectionReport | null;
};

const STORAGE_KEY = 'pharma_currentInspection_v1';

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const useInspection = () => {
    const ctx = useContext(InspectionContext);
    if (!ctx) throw new Error('useInspection must be used within an InspectionProvider');
    return ctx;
};

export const InspectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentInspection, setCurrentInspection] = useState<DraftInspection | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) as DraftInspection : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (currentInspection) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentInspection));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [currentInspection]);

    const startInspection = (initial?: Partial<DraftInspection>) => {
        const draft: DraftInspection = {
            pharmacyInfo: (initial?.pharmacyInfo ?? null) as PharmacyInfo | null,
            pharmacistInfo: (initial?.pharmacistInfo ?? null) as PharmacistInfo | null,
            answers: initial?.answers ?? []
        };
        setCurrentInspection(draft);
    };

    const updateAnswers = (answers: InspectionAnswer[]) => {
        setCurrentInspection(prev => prev ? ({ ...prev, answers }) : ({ pharmacyInfo: null, pharmacistInfo: null, answers }));
    };

    const updateMeta = (payload: { pharmacy?: PharmacyInfo; pharmacist?: PharmacistInfo }) => {
        setCurrentInspection(prev => prev ? ({ ...prev, pharmacyInfo: payload.pharmacy ?? prev.pharmacyInfo, pharmacistInfo: payload.pharmacist ?? prev.pharmacistInfo }) : ({ pharmacyInfo: payload.pharmacy ?? null, pharmacistInfo: payload.pharmacist ?? null, answers: [] }));
    };

    const [completedInspection, setCompletedInspection] = useState<InspectionReport | null>(null);
    const completeInspection = () => {
        if (!currentInspection) return null;
        const final = inspectionReportService.createReport(
            currentInspection.pharmacyInfo as PharmacyInfo,
            currentInspection.pharmacistInfo as PharmacistInfo,
            currentInspection.answers
        );
        setCompletedInspection(final);
        // optionally clear draft after completion
        // setCurrentInspection(null);
        return final;
    };

    const setInspection = (r: DraftInspection | null) => setCurrentInspection(r);

    const clearInspection = () => {
        setCurrentInspection(null);
        inspectionReportService.clearReport();
    };

    return (
        <InspectionContext.Provider value={{ currentInspection, startInspection, updateAnswers, updateMeta, completeInspection, setInspection, clearInspection, completedInspection }}>
            {children}
        </InspectionContext.Provider>
    );
};