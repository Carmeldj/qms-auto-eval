import React from 'react';
import { BarChart, Download, TrendingUp, AlertCircle, CheckCircle, FileText, Home } from 'lucide-react';
import { Assessment } from '../types';
import { principles } from '../data/principles';
import { pmqCategories } from '../data/principles';
import { getRecommendations, actionPlan12Months, qualityTools } from '../data/recommendations';
import jsPDF from 'jspdf';
import { useAssessmentContext } from '../contexts/AssessmentContext';
import { useNavigate } from 'react-router-dom';

const Results: React.FC = () => {
  const navigate = useNavigate();

  const { currentAssessment, clearAssessment } = useAssessmentContext();
  if (!currentAssessment) {
    return null; // Or render a fallback UI/message if preferred
  }
  const assessment: Assessment = currentAssessment;

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return CheckCircle;
    if (score >= 3) return AlertCircle;
    return AlertCircle;
  };

  const formatScore = (score: number) => {
    return `${score.toFixed(1)}/5`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate recommendations for low-scoring principles
  const lowScoringPrinciples = Object.entries(assessment.scores.principles)
    .filter(([_, score]) => score < 3)
    .map(([principleId, score]) => ({
      principle: principles.find(p => p.id === principleId)!,
      score,
      recommendations: getRecommendations(principleId, score)
    }));

  const highPriorityActions = lowScoringPrinciples
    .flatMap(item => item.recommendations)
    .filter(rec => rec.priority === 'high');

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = 'black', lineSpacing: number = 1.15) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }

      if (color === 'teal') {
        pdf.setTextColor(0, 150, 136);
      } else if (color === 'gray') {
        pdf.setTextColor(100, 100, 100);
      } else {
        pdf.setTextColor(0, 0, 0);
      }

      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      const lineHeight = fontSize * 0.35 * lineSpacing;
      yPosition += lines.length * lineHeight + 3;

      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    const addSection = (title: string) => {
      yPosition += 8;
      const lineY = yPosition;
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(0.5);
      pdf.line(margin, lineY, pageWidth - margin, lineY);
      yPosition += 5;
      addText(title, 12, true, 'teal', 1.0);
      yPosition += 3;
    };

    // En-tête du rapport
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 150, 136);
    const titleWidth = pdf.getTextWidth('RAPPORT D\'ÉVALUATION PHARMA QMS');
    pdf.text('RAPPORT D\'ÉVALUATION PHARMA QMS', (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 8;

    // Résumé exécutif
    addSection('RÉSUMÉ EXÉCUTIF');
    addText(`Date d'évaluation: ${formatDate(assessment.date)}`, 12);
    addText(`Score global: ${formatScore(assessment.scores.overall)}`, 14, true);

    const overallLevel = assessment.scores.overall >= 4 ? 'Excellent' :
      assessment.scores.overall >= 3 ? 'Satisfaisant' : 'À améliorer';
    addText(`Niveau de maturité: ${overallLevel}`, 12);

    const principlesCount = Object.values(assessment.scores.principles);
    const excellentCount = principlesCount.filter(s => s >= 4).length;
    const goodCount = principlesCount.filter(s => s >= 3 && s < 4).length;
    const improvementCount = principlesCount.filter(s => s < 3).length;

    addText(`Répartition des 29 directives: ${excellentCount} excellents, ${goodCount} satisfaisants, ${improvementCount} à améliorer`, 12);

    // Détail des 29 Directives Qualité
    addSection('DÉTAIL DES 29 DIRECTIVES QUALITÉ');

    pmqCategories.forEach(pmq => {
      const pmqScore = assessment.scores.pmqs[pmq.id] || 0;
      const pmqPrinciples = principles.filter(p => p.pmq === pmq.id);

      addText(`PMQ ${pmq.id} - ${pmq.title}: ${formatScore(pmqScore)}`, 12, true);

      // Ajouter une phrase descriptive pour chaque PMQ
      const pmqDescriptions: Record<number, string> = {
        1: "Cette section évalue la capacité de l'officine à identifier, comprendre et satisfaire les besoins de ses patients, ainsi qu'à gérer efficacement leurs retours et réclamations.",
        2: "Cette section examine l'engagement de la direction dans la démarche qualité, la définition d'une vision claire et l'allocation des ressources nécessaires au bon fonctionnement du système qualité.",
        3: "Cette section analyse l'implication du personnel dans la démarche qualité, leurs compétences, leur formation continue et la qualité de la communication interne.",
        4: "Cette section constitue le cœur opérationnel du SMQ, couvrant tous les processus pharmaceutiques depuis la dispensation jusqu'à la gestion des stocks, en passant par la traçabilité et les contrôles qualité.",
        5: "Cette section évalue la capacité de l'officine à identifier les opportunités d'amélioration, à innover et à mettre en place des plans d'amélioration continue efficaces.",
        6: "Cette section examine l'utilisation des données et indicateurs pour orienter les décisions, incluant la collecte, l'analyse et le benchmarking des performances.",
        7: "Cette section évalue la gestion des relations avec tous les partenaires externes : fournisseurs, professionnels de santé, patients et communauté locale."
      };

      addText(pmqDescriptions[pmq.id] || '', 10);
      yPosition += 3;

      pmqPrinciples.forEach(principle => {
        const score = assessment.scores.principles[principle.id] || 0;
        const answer = assessment.answers.find(a => a.principleId === principle.id);
        const status = score >= 4 ? 'Excellent' : score >= 3 ? 'Satisfaisant' : 'À améliorer';
        const progress = `${Math.round((score / 5) * 100)}%`;
        const responsible = score <= 2 ? 'Pharmacien titulaire' : score <= 3 ? 'Responsable qualité' : 'Pharmacien adjoint';

        addText(`  • ${principle.title}`, 10);
        addText(`    Statut: ${status} | Progrès: ${progress} | Responsable: ${responsible}`, 9);

        // Ajouter le commentaire s'il existe
        if (answer?.comment && answer.comment.trim()) {
          addText(`    Commentaire: ${answer.comment.trim()}`, 9);
        }
      });
      yPosition += 5;
    });

    // Outils à implémenter
    addSection('OUTILS À IMPLÉMENTER');

    const recommendedTools = new Set<string>();
    lowScoringPrinciples.forEach(item => {
      const tools = item.recommendations.filter(rec => rec.category.startsWith('Outil'));
      tools.forEach(tool => recommendedTools.add(tool.title));
    });

    Array.from(recommendedTools).forEach((toolTitle, index) => {
      const tool = qualityTools.find(t => toolTitle.includes(t.name));
      if (tool) {
        addText(`${index + 1}. ${tool.name}`, 11, true);
        addText(`   ${tool.description}`, 10);
        addText(`   Catégorie: ${tool.category} | Temps d'implémentation: ${tool.implementationTime}`, 9);
      }
    });

    // Plan d'action sur 12 mois
    addSection('PLAN D\'ACTION SUR 12 MOIS');

    for (let month = 1; month <= 12; month++) {
      const monthActions = actionPlan12Months.filter(action => action.month === month);
      if (monthActions.length > 0) {
        addText(`Mois ${month}:`, 12, true);
        monthActions.forEach(action => {
          addText(`• ${action.title}`, 10, true);
          addText(`  ${action.description}`, 9);
          addText(`  Responsable: ${action.responsible} | Durée: ${action.duration}`, 9);
          addText(`  Livrables: ${action.deliverables.join(', ')}`, 9);
          if (action.dependencies) {
            addText(`  Dépendances: ${action.dependencies.join(', ')}`, 9);
          }
          yPosition += 3;
        });
      }
    }

    // Actions prioritaires détaillées
    if (highPriorityActions.length > 0) {
      addSection('ACTIONS PRIORITAIRES DÉTAILLÉES');
      highPriorityActions.forEach((action, index) => {
        addText(`${index + 1}. ${action.title}`, 11, true);
        addText(`${action.description}`, 10);
        addText(`Responsable: ${action.responsible} | Catégorie: ${action.category}`, 9);
        yPosition += 3;
      });
    }

    // Analyse détaillée par PMQ
    addSection('ANALYSE DÉTAILLÉE PAR PMQ');
    pmqCategories.forEach(pmq => {
      const score = assessment.scores.pmqs[pmq.id] || 0;
      const status = score >= 4 ? 'Excellent' : score >= 3 ? 'Satisfaisant' : 'Nécessite amélioration';

      addText(`PMQ ${pmq.id} - ${pmq.title}`, 12, true);
      addText(`Score: ${formatScore(score)} - ${status}`, 11);
      addText(`${pmq.description}`, 10);

      const pmqPrinciples = principles.filter(p => p.pmq === pmq.id);
      const lowScoring = pmqPrinciples.filter(p => (assessment.scores.principles[p.id] || 0) < 3);

      if (lowScoring.length > 0) {
        addText('Axes d\'amélioration prioritaires:', 10, true);
        lowScoring.forEach(principle => {
          const answer = assessment.answers.find(a => a.principleId === principle.id);
          addText(`• ${principle.title}`, 9);
          if (answer?.comment && answer.comment.trim()) {
            addText(`  Contexte: ${answer.comment.trim()}`, 8);
          }
        });
      }

      // Ajouter une section pour les commentaires généraux du PMQ
      const pmqComments = pmqPrinciples
        .map(p => assessment.answers.find(a => a.principleId === p.id))
        .filter(a => a?.comment && a.comment.trim())
        .map(a => a!);

      if (pmqComments.length > 0) {
        addText('Commentaires et observations:', 10, true);
        pmqComments.forEach(answer => {
          const principle = principles.find(p => p.id === answer.principleId);
          addText(`• ${principle?.title}:`, 9, true);
          addText(`  ${answer.comment!.trim()}`, 8);
        });
      }

      yPosition += 5;
    });

    // Recommandation finale
    addSection('RECOMMANDATION PROFESSIONNELLE');
    addText('Les résultats de cette évaluation montrent qu\'un système qualité solide ne peut s\'improviser : il exige méthode, suivi et outils adaptés. Pour transformer vos efforts en véritables résultats mesurables, adoptez PharmaQMS, la solution digitale conçue pour les officines africaines et alignée sur la norme ISO 9001.', 11, false, 'teal');

    // Save the PDF
    const fileName = `plan-qualite-pharma-qms-${new Date(assessment.date).toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Résultats de l'évaluation PHARMA QMS
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Évaluation réalisée le {formatDate(assessment.date)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                navigate('/');
                clearAssessment();
              }}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 active:scale-95"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#718096'}
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Accueil</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center space-x-2 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 active:scale-95"
              style={{ backgroundColor: '#009688' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Plan Qualité PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white" style={{ background: 'linear-gradient(to right, #009688, #00bcd4)' }}>
        <div className="text-center">
          <BarChart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-90" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Score Global SMQ</h2>
          <div className="text-4xl sm:text-5xl font-bold mb-2">
            {formatScore(assessment.scores.overall)}
          </div>
          <p className="text-sm sm:text-base" style={{ color: '#b2dfdb' }}>
            {assessment.scores.overall >= 4 ? 'Excellent niveau de maturité' :
              assessment.scores.overall >= 3 ? 'Bon niveau de maturité' :
                'Niveau de maturité à améliorer'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* PMQ Scores */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Scores par PMQ</h3>
          <div className="space-y-3 sm:space-y-4">
            {pmqCategories.map(pmq => {
              const score = assessment.scores.pmqs[pmq.id] || 0;
              const IconComponent = getScoreIcon(score);

              return (
                <div key={pmq.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${getScoreColor(score)}`}>
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">PMQ {pmq.id}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{pmq.title}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`font-bold text-base sm:text-lg ${score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatScore(score)}
                    </div>
                    <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Actions */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Actions Prioritaires</h3>
          {highPriorityActions.length > 0 ? (
            <div className="space-y-4">
              {highPriorityActions.slice(0, 5).map(action => (
                <div key={action.id} className="border-l-4 border-red-500 pl-3 sm:pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{action.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{action.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Priorité élevée
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {action.responsible}
                    </span>
                  </div>
                </div>
              ))}
              {highPriorityActions.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  Et {highPriorityActions.length - 5} autres actions prioritaires...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Aucune action prioritaire identifiée.</p>
              <p className="text-sm text-gray-500">Votre SMQ présente un bon niveau de maturité.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analysis */}
      {lowScoringPrinciples.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Analyse Détaillée - Axes d'Amélioration
          </h3>

          <div className="space-y-6">
            {lowScoringPrinciples.map(item => (
              <div key={item.principle.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {item.principle.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      PMQ {item.principle.pmq} - {item.principle.pmqTitle}
                    </p>
                    <p className="text-gray-700">{item.principle.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(item.score)}`}>
                    {formatScore(item.score)}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {item.recommendations.map(rec => (
                    <div key={rec.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{rec.title}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {rec.priority === 'high' ? 'Élevée' : rec.priority === 'medium' ? 'Moyenne' : 'Faible'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{rec.responsible}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {rec.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {assessment.answers.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Questions évaluées</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {Object.values(assessment.scores.principles).filter(s => s >= 4).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Principes excellents</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">
            {Object.values(assessment.scores.principles).filter(s => s >= 3 && s < 4).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Principes à surveiller</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {Object.values(assessment.scores.principles).filter(s => s < 3).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Principes à améliorer</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={() => {
            navigate("/")
            clearAssessment();
          }}
          className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-700 active:scale-95 transition-all duration-200"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Nouvelle évaluation</span>
        </button>

        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center space-x-2 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold active:scale-95 transition-all duration-200"
          style={{ backgroundColor: '#009688' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Plan Qualité PDF</span>
        </button>
      </div>
    </div>
  );
};

export default Results;