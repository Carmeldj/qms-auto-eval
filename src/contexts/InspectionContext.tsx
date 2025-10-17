import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { InspectionReport, InspectionAnswer, PharmacyInfo, PharmacistInfo } from '../types';
import { inspectionReportService } from '../services/InspectionReportService';

type InspectionContextType = {
    currentInspection: InspectionReport | null;
    startInspection: (initial?: Partial<InspectionReport>) => void;
    updateAnswers: (answers: InspectionAnswer[]) => void;
    updateMeta: (payload: { pharmacy?: PharmacyInfo; pharmacist?: PharmacistInfo }) => void;
    completeInspection: (pharmacyInfo: PharmacyInfo, pharmacistInfo: PharmacistInfo, answers: InspectionAnswer[]) => InspectionReport | null;
    setInspection: (r: InspectionReport | null) => void;
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
    const [currentInspection, setCurrentInspection] = useState<InspectionReport | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) as InspectionReport : null;
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

    const startInspection = (initial?: Partial<InspectionReport>) => {
        const newReport: InspectionReport = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            pharmacyInfo: (initial?.pharmacyInfo ?? null) as any,
            pharmacistInfo: (initial?.pharmacistInfo ?? null) as any,
            answers: initial?.answers ?? [],
            summary: {
                totalItems: 0,
                compliant: 0,
                nonCompliant: 0,
                notApplicable: 0,
                criticalGaps: 0,
                majorGaps: 0,
                minorGaps: 0
            }
        };
        setCurrentInspection(newReport);
    };

    const updateAnswers = (answers: InspectionAnswer[]) => {
        setCurrentInspection(prev => prev ? ({ ...prev, answers }) : prev);
    };

    const updateMeta = (payload: { pharmacy?: PharmacyInfo; pharmacist?: PharmacistInfo }) => {
        setCurrentInspection(prev => prev ? ({ ...prev, pharmacyInfo: payload.pharmacy ?? prev.pharmacyInfo, pharmacistInfo: payload.pharmacist ?? prev.pharmacistInfo }) : prev);
    };

    const [completedInspection, setCompletedInspection] = useState<InspectionReport | null>(null);
    const completeInspection = (pharmacyInfo: PharmacyInfo, pharmacistInfo: PharmacistInfo, answers: InspectionAnswer[]) => {
        // if (!currentInspection) return null;
        // you can pass to inspectionReportService to persist or compute a final report
        const final = inspectionReportService.createReport(
            pharmacyInfo,
            pharmacistInfo,
            answers
        );
        // optionally clear stored draft
        // setCurrentInspection(null);
        setCompletedInspection(final);
        return final;
    };

    const setInspection = (r: InspectionReport | null) => setCurrentInspection(r);

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