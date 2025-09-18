import React from 'react';
import { Download, Home, AlertTriangle, CheckCircle, XCircle, FileText, TrendingUp } from 'lucide-react';
import { InspectionReport } from '../types/inspection';
import { inspectionItems, getAllCategories, getItemsByCategory } from '../data/inspectionItems';
import { generateRecommendations } from '../data/inspectionRecommendations';
import { inspectionReportService } from '../services/InspectionReportService';

interface InspectionResultsProps {
  report: InspectionReport;
  onBackToHome: () => void;
}

const InspectionResults: React.FC<InspectionResultsProps> = ({ report, onBackToHome }) => {
  const recommendations = generateRecommendations(report.answers);
  const categories = getAllCategories();
  const realTimeStats = inspectionReportService.calculateRealTimeStats(report.answers);
  const complianceRate = inspectionReportService.getComplianceRate(report.answers);
  const complianceLevel = inspectionReportService.getComplianceLevel(complianceRate);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'non-compliant': return XCircle;
      case 'not-applicable': return FileText;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-600';
      case 'non-compliant': return 'bg-red-100 text-red-600';
      case 'not-applicable': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const handleExportPDF = async () => {
    try {
      console.log('InspectionResults: Starting PDF export for report:', report);
      
      // Vérification des données avant export
      if (!report || !report.pharmacyInfo || !report.pharmacistInfo) {
        throw new Error('Données du rapport manquantes');
      }
      
      await inspectionReportService.generatePDF(report);
      console.log('InspectionResults: PDF export completed successfully');
    } catch (error) {
      console.error('InspectionResults: PDF export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de la génération du PDF: ${errorMessage}`);
    }
  };

  // Debug logging
  console.log('InspectionResults - Report:', report);
  console.log('InspectionResults - Answers:', report.answers);
  console.log('InspectionResults - Real-time stats:', realTimeStats);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Debug Info - Remove in production */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-yellow-800 mb-2">Debug Info:</h4>
        <p className="text-sm text-yellow-700">
          Réponses reçues: {report.answers.length} | 
          Conformes: {realTimeStats.compliant} | 
          Non conformes: {realTimeStats.nonCompliant} | 
          Non applicables: {realTimeStats.notApplicable}
        </p>
      </div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rapport d'Auto-inspection
            </h1>
            <p className="text-gray-600">
              {report.pharmacyInfo.name} - {formatDate(report.date)}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              <Home className="h-5 w-5" />
              <span>Accueil</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              style={{backgroundColor: '#009688'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
            >
              <Download className="h-5 w-5" />
              <span>Exporter PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Compliance */}
      <div className="rounded-xl p-8 mb-8 text-white" style={{background: 'linear-gradient(to right, #009688, #00bcd4)'}}>
        <div className="text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">Taux de Conformité Global</h2>
          <div className="text-5xl font-bold mb-2">
            {complianceRate}%
          </div>
          <p style={{color: '#b2dfdb'}}>
            Niveau de conformité: {complianceLevel.level} • {realTimeStats.totalItems}/{realTimeStats.totalPossibleItems} éléments évalués
          </p>
          {realTimeStats.unanswered > 0 && (
            <p className="text-sm mt-2" style={{color: '#b2dfdb'}}>
              {realTimeStats.unanswered} élément(s) non évalué(s) - considéré(s) comme conforme(s) par défaut
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Summary Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Synthèse de l'inspection</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="font-medium text-green-800">Éléments conformes</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {realTimeStats.compliant}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="font-medium text-red-800">Éléments non conformes</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {realTimeStats.nonCompliant}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-gray-600" />
                <span className="font-medium text-gray-800">Non applicables</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">
                {realTimeStats.notApplicable}
              </span>
            </div>
          </div>

          {/* Gap Classification */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Classification des écarts</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Écarts critiques</span>
                </div>
                <span className="text-xl font-bold text-red-600">
                  {realTimeStats.criticalGaps}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">Risques majeurs</span>
                </div>
                <span className="text-xl font-bold text-orange-600">
                  {realTimeStats.majorGaps}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Écarts mineurs</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">
                  {realTimeStats.minorGaps}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recommandations Prioritaires</h3>
          
          {realTimeStats.nonCompliant > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Analyse des écarts identifiés
                </h4>
                <p className="text-sm text-blue-800">
                  {realTimeStats.criticalGaps > 0 && `${realTimeStats.criticalGaps} écart(s) critique(s) nécessitant une action immédiate. `}
                  {realTimeStats.majorGaps > 0 && `${realTimeStats.majorGaps} risque(s) majeur(s) à traiter en urgence. `}
                  {realTimeStats.minorGaps > 0 && `${realTimeStats.minorGaps} écart(s) mineur(s) à intégrer dans l'amélioration continue.`}
                  {realTimeStats.criticalGaps === 0 && realTimeStats.majorGaps === 0 && realTimeStats.minorGaps === 0 && 
                   realTimeStats.nonCompliant > 0 && `${realTimeStats.nonCompliant} écart(s) identifié(s) sans classification de risque.`}
                </p>
              </div>
              
              {/* Show actual non-compliant items with real recommendations */}
              {report.answers
                .filter(a => a.status === 'non-compliant')
                .slice(0, 6)
                .map(answer => {
                const item = inspectionItems.find(i => i.id === answer.itemId);
                const rec = recommendations.find(r => r.id === `rec-${answer.itemId}`);
                
                if (!item || !rec) return null;
                
                const priorityColors = {
                  immediate: 'border-red-500 bg-red-50',
                  urgent: 'border-orange-500 bg-orange-50',
                  planned: 'border-yellow-500 bg-yellow-50'
                };
                
                const priorityLabels = {
                  immediate: 'Immédiat',
                  urgent: 'Urgent',
                  planned: 'Planifié'
                };
                
                return (
                  <div key={answer.itemId} className={`border-l-4 pl-4 py-3 ${priorityColors[rec.priority]}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'immediate' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'urgent' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {priorityLabels[rec.priority]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      <strong>Élément concerné :</strong> {item?.description}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    {answer.comment && answer.comment.trim() && (
                      <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded mb-2">
                        <strong>Observation :</strong> {answer.comment}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Délai: {rec.timeframe}</span>
                      <span>Responsable: {rec.responsible}</span>
                      {answer.gapType && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          answer.gapType === 'critical' ? 'bg-red-100 text-red-700' :
                          answer.gapType === 'major' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          Écart {answer.gapType === 'critical' ? 'critique' : 
                                 answer.gapType === 'major' ? 'majeur' : 'mineur'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
              
              {report.answers.filter(a => a.status === 'non-compliant').length > 6 && (
                <p className="text-sm text-gray-500 text-center">
                  Et {report.answers.filter(a => a.status === 'non-compliant').length - 6} autres recommandations dans le rapport PDF...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">
                Aucune action corrective requise.
              </p>
              <p className="text-sm text-gray-500">
                {realTimeStats.totalItems > 0 
                  ? 'Tous les éléments évalués sont conformes.' 
                  : 'Commencez l\'inspection pour voir les recommandations.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Results by Category */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Résultats Détaillés par Catégorie
        </h3>
        
        <div className="space-y-6">
          {categories.map(category => {
            const categoryItems = getItemsByCategory(category);
            // Only get answers that actually exist for this category
            const categoryAnswers = report.answers.filter(a => 
              categoryItems.some(item => item.id === a.itemId)
            );
            
            const compliantCount = categoryAnswers.filter(a => a.status === 'compliant').length;
            const nonCompliantCount = categoryAnswers.filter(a => a.status === 'non-compliant').length;
            const notApplicableCount = categoryAnswers.filter(a => a.status === 'not-applicable').length;
            const answeredCount = categoryAnswers.length;
            const unansweredCount = categoryItems.length - answeredCount;
            
            // Calculate compliance rate based on answered items only
            const categoryComplianceRate = answeredCount > 0 ? Math.round((compliantCount / answeredCount) * 100) : 0;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg">{category}</h4>
                  <div className="flex items-center space-x-4">
                    {answeredCount > 0 ? (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categoryComplianceRate >= 90 ? 'bg-green-100 text-green-800' :
                      categoryComplianceRate >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {categoryComplianceRate}% conforme
                    </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Non évalué
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {answeredCount}/{categoryItems.length} évalués
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{compliantCount}</div>
                    <div className="text-xs text-green-700">Conformes</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{nonCompliantCount}</div>
                    <div className="text-xs text-red-700">Non conformes</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-600">{notApplicableCount}</div>
                    <div className="text-xs text-gray-700">Non applicables</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{unansweredCount}</div>
                    <div className="text-xs text-blue-700">Non évalués</div>
                  </div>
                </div>

                {/* Show all items with their real status */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">
                    Détail des éléments ({answeredCount} évalués sur {categoryItems.length}) :
                  </h5>
                  {categoryItems.map(item => {
                    const itemAnswer = report.answers.find(a => a.itemId === item.id);
                    const StatusIcon = getStatusIcon(itemAnswer?.status || 'not-evaluated');
                    
                    return (
                      <div key={item.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                        itemAnswer ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className={`p-1 rounded-full ${getStatusColor(itemAnswer?.status || 'not-evaluated')}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.description}</div>
                          <div className="text-xs text-gray-500 mb-1">
                            Exigence: {item.requirement}
                          </div>
                          <div className="text-sm text-gray-600">
                            Statut: {
                              itemAnswer?.status === 'compliant' ? 'Conforme' :
                              itemAnswer?.status === 'non-compliant' ? 'Non conforme' :
                              itemAnswer?.status === 'not-applicable' ? 'Non applicable' :
                              'Non évalué (considéré conforme par défaut)'
                            }
                            {itemAnswer?.status === 'non-compliant' && itemAnswer.gapType && (
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                itemAnswer.gapType === 'critical' ? 'bg-red-100 text-red-800' :
                                itemAnswer.gapType === 'major' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                Écart {itemAnswer.gapType === 'critical' ? 'critique' : 
                                       itemAnswer.gapType === 'major' ? 'majeur' : 'mineur'}
                              </span>
                            )}
                          </div>
                          {itemAnswer?.comment && itemAnswer.comment.trim() && (
                            <div className="text-sm text-gray-700 mt-1 italic">
                              <strong>Observation:</strong> "{itemAnswer.comment.trim()}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show specific corrective actions for this category */}
                {categoryAnswers.filter(a => a.status === 'non-compliant').length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-red-800 mt-4">
                      Actions correctives requises pour cette catégorie :
                    </h5>
                    {categoryAnswers
                      .filter(a => a.status === 'non-compliant')
                      .map(answer => {
                        const item = inspectionItems.find(i => i.id === answer.itemId);
                        const recommendation = recommendations.find(r => r.id === `rec-${answer.itemId}`);
                        
                        return (
                          <div key={answer.itemId} className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="font-medium text-red-900">
                              • {recommendation?.title || `Corriger: ${item?.description}`}
                            </div>
                            <div className="text-sm text-red-700 mt-1">
                              {recommendation?.description || `Mettre en conformité selon: ${item?.requirement}`}
                            </div>
                            <div className="flex items-center space-x-3 mt-2 text-xs text-red-600">
                              <span>Délai: {recommendation?.timeframe || '1-2 semaines'}</span>
                              <span>Responsable: {recommendation?.responsible || 'Pharmacien titulaire'}</span>
                              {answer.gapType && (
                                <span className="font-medium">
                                  [{answer.gapType === 'critical' ? 'CRITIQUE' : 
                                    answer.gapType === 'major' ? 'MAJEUR' : 'MINEUR'}]
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
                
                {/* Show summary for compliant items */}
                {compliantCount > 0 && answeredCount > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {compliantCount} élément{compliantCount > 1 ? 's' : ''} conforme{compliantCount > 1 ? 's' : ''} validé{compliantCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
                
                {notApplicableCount > 0 && answeredCount > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">
                        {notApplicableCount} élément{notApplicableCount > 1 ? 's' : ''} non applicable{notApplicableCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Show unanswered items info */}
                {unansweredCount > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {unansweredCount} élément{unansweredCount > 1 ? 's' : ''} non évalué{unansweredCount > 1 ? 's' : ''} 
                        (considéré{unansweredCount > 1 ? 's' : ''} conforme{unansweredCount > 1 ? 's' : ''} par défaut)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200"
        >
          <Home className="h-5 w-5" />
          <span>Nouvelle inspection</span>
        </button>
        
        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
          style={{backgroundColor: '#009688'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
        >
          <Download className="h-5 w-5" />
          <span>Rapport PDF</span>
        </button>
      </div>
    </div>
  );
};

export default InspectionResults;