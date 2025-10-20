import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { actionPlan12Months } from '../data/recommendations';
import { qualityTools } from '../data/qualityTools';

const ActionPlanView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const getMonthActions = (month: number) => {
    return actionPlan12Months.filter(action => action.month === month);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return FileText;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Plan d'Action Qualité - 12 Mois
        </h1>
        <p className="text-gray-600">
          Roadmap détaillée pour l'implémentation du système de management de la qualité
        </p>
      </div>

      {/* Timeline Overview */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Vue d'ensemble chronologique</h2>
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
            const actions = getMonthActions(month);
            const hasHighPriority = actions.some(a => a.priority === 'high');
            
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                  selectedMonth === month
                    ? 'border-teal-500 bg-teal-50'
                    : hasHighPriority
                    ? 'border-red-200 bg-red-50 hover:bg-red-100'
                    : actions.length > 0
                    ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium text-gray-900">M{month}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {actions.length} action{actions.length > 1 ? 's' : ''}
                </div>
                {hasHighPriority && (
                  <AlertTriangle className="h-3 w-3 text-red-500 mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Actions */}
      {selectedMonth ? (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Actions du Mois {selectedMonth}
          </h3>
          <div className="space-y-6">
            {getMonthActions(selectedMonth).map(action => {
              const PriorityIcon = getPriorityIcon(action.priority);
              
              return (
                <div key={action.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">
                        {action.title}
                      </h4>
                      <p className="text-gray-600 mb-3">{action.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full border flex items-center space-x-1 ${getPriorityColor(action.priority)}`}>
                      <PriorityIcon className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {action.priority === 'high' ? 'Élevée' : action.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        <strong>Responsable:</strong> {action.responsible}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        <strong>Durée:</strong> {action.duration}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Livrables attendus:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {action.deliverables.map((deliverable, index) => (
                        <li key={index} className="text-sm text-gray-600">{deliverable}</li>
                      ))}
                    </ul>
                  </div>

                  {action.dependencies && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Dépendances:</h5>
                      <div className="flex flex-wrap gap-2">
                        {action.dependencies.map((dep, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Sélectionnez un mois dans la timeline ci-dessus pour voir le détail des actions
          </p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {actionPlan12Months.length}
          </div>
          <div className="text-sm text-gray-600">Actions totales</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {actionPlan12Months.filter(a => a.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600">Priorité élevée</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {actionPlan12Months.filter(a => a.priority === 'medium').length}
          </div>
          <div className="text-sm text-gray-600">Priorité moyenne</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold" style={{color: '#009688'}}>
            {qualityTools.length}
          </div>
          <div className="text-sm text-gray-600">Outils qualité</div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlanView;