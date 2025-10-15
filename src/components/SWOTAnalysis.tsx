import React, { useState } from 'react';
import { ArrowLeft, Download, Target, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { swotQuestions, swotCategories } from '../data/swotQuestions';
import jsPDF from 'jspdf';

interface SWOTAnalysisProps {
  onBack: () => void;
}

const SWOTAnalysis: React.FC<SWOTAnalysisProps> = ({ onBack }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [pharmacyName, setPharmacyName] = useState<string>('');
  const [pharmacistName, setPharmacistName] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('strengths');

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getCurrentCategoryQuestions = () => {
    return swotQuestions.filter(q => q.category === currentCategory);
  };

  const getCurrentCategory = () => {
    return swotCategories.find(c => c.id === currentCategory)!;
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'strengths': return Target;
      case 'weaknesses': return AlertTriangle;
      case 'opportunities': return TrendingUp;
      case 'threats': return Shield;
      default: return Target;
    }
  };

  const isComplete = () => {
    return pharmacyName.trim() && pharmacistName.trim() && swotQuestions.every(q => responses[q.id]?.trim());
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 20;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 150, 136);
    pdf.text('Analyse SWOT - Officine', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    pdf.setDrawColor(0, 150, 136);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pharmacie:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(pharmacyName, margin + 30, yPos);
    yPos += 6;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Pharmacien:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(pharmacistName, margin + 30, yPos);
    yPos += 10;

    swotCategories.forEach(category => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      const lineY = yPos;
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(0.5);
      pdf.line(margin, lineY, pageWidth - margin, lineY);
      yPos += 5;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 150, 136);
      pdf.text(category.title, margin, yPos);
      yPos += 6;
      pdf.setTextColor(0, 0, 0);

      const questions = swotQuestions.filter(q => q.category === category.id);
      questions.forEach((q, index) => {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        const questionLines = pdf.splitTextToSize(`${index + 1}. ${q.question}`, pageWidth - 2 * margin);
        pdf.text(questionLines, margin, yPos);
        yPos += questionLines.length * 5 + 2;

        pdf.setFont('helvetica', 'normal');
        const response = responses[q.id] || 'Non renseigné';
        const lines = pdf.splitTextToSize(response, pageWidth - 2 * margin - 5);
        pdf.text(lines, margin + 5, yPos);
        yPos += lines.length * 4.5 + 4;
      });

      yPos += 5;
    });

    pdf.save(`SWOT_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const categoryInfo = getCurrentCategory();
  const questions = getCurrentCategoryQuestions();
  const Icon = getCategoryIcon(currentCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${categoryInfo.color}20` }}>
              <Icon className="h-6 w-6" style={{ color: categoryInfo.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analyse SWOT</h1>
              <p className="text-gray-600">Évaluation stratégique de votre officine</p>
            </div>
          </div>
          {isComplete() && (
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Exporter PDF</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nom de la pharmacie *
            </label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Pharmacie Centrale"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nom du pharmacien *
            </label>
            <input
              type="text"
              value={pharmacistName}
              onChange={(e) => setPharmacistName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Dr. Jean Dupont"
            />
          </div>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {swotCategories.map(category => {
            const CategoryIcon = getCategoryIcon(category.id);
            const categoryQuestions = swotQuestions.filter(q => q.category === category.id);
            const answeredCount = categoryQuestions.filter(q => responses[q.id]?.trim()).length;

            return (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  currentCategory === category.id
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={currentCategory === category.id ? { backgroundColor: category.color } : {}}
              >
                <CategoryIcon className="h-4 w-4" />
                <span className="font-medium">{category.title.split(' ')[0]}</span>
                <span className="text-xs opacity-75">({answeredCount}/{categoryQuestions.length})</span>
              </button>
            );
          })}
        </div>

        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${categoryInfo.color}10` }}>
          <h2 className="font-semibold text-lg mb-1" style={{ color: categoryInfo.color }}>
            {categoryInfo.title}
          </h2>
          <p className="text-gray-600 text-sm">{categoryInfo.description}</p>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <label className="block mb-3">
                <span className="font-semibold text-gray-900 mb-2 block">
                  {index + 1}. {question.question}
                </span>
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Votre réponse..."
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SWOTAnalysis;
