import React, { useState } from 'react';
import { Building, User, ClipboardCheck, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { PharmacyInfo, PharmacistInfo, InspectionAnswer } from '../types/inspection';
import { inspectionItems, getAllCategories, getItemsByCategory } from '../data/inspectionItems';

interface InspectionFormProps {
  onComplete: (pharmacyInfo: PharmacyInfo, pharmacistInfo: PharmacistInfo, answers: InspectionAnswer[]) => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'pharmacy' | 'pharmacist' | 'inspection'>('pharmacy');
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfo>({
    name: '',
    purchaseAuthNumber: '',
    openingQuitus: '',
    privateClienteleAuth: '',
    location: '',
    status: '',
    email: ''
  });
  const [pharmacistInfo, setPharmacistInfo] = useState<PharmacistInfo>({
    firstName: '',
    lastName: '',
    orderNumber: '',
    email: '',
    phone: ''
  });
  const [answers, setAnswers] = useState<InspectionAnswer[]>([]);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [showGapClassification, setShowGapClassification] = useState<string | null>(null);

  const categories = getAllCategories();
  const currentCategoryItems = getItemsByCategory(categories[currentCategory]);

  const handlePharmacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('pharmacist');
  };

  const handlePharmacistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('inspection');
  };

  const handleAnswerChange = (itemId: string, status: 'compliant' | 'non-compliant' | 'not-applicable', comment?: string, gapType?: 'critical' | 'major' | 'minor') => {
    const existingIndex = answers.findIndex(a => a.itemId === itemId);
    const newAnswer: InspectionAnswer = { itemId, status, comment, gapType };

    if (existingIndex >= 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingIndex] = newAnswer;
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, newAnswer]);
    }

    // Always show gap classification for non-compliant items
    setShowGapClassification(status === 'non-compliant' ? itemId : null);
  };

  const handleComplete = () => {
    console.log('InspectionForm: Completing inspection with answers:', answers);
    console.log('InspectionForm: Pharmacy info:', pharmacyInfo);
    console.log('InspectionForm: Pharmacist info:', pharmacistInfo);
    onComplete(pharmacyInfo, pharmacistInfo, answers);
  };

  const getAnsweredCount = () => {
    return answers.length;
  };

  const canComplete = () => {
    // Allow completion when at least 50% of items are answered
    return answers.length >= Math.ceil(inspectionItems.length * 0.5);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'non-compliant': return XCircle;
      case 'not-applicable': return FileText;
      default: return ClipboardCheck;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100 border-green-200';
      case 'non-compliant': return 'text-red-600 bg-red-100 border-red-200';
      case 'not-applicable': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  if (step === 'pharmacy') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-lg" style={{backgroundColor: '#e0f2f1'}}>
              <Building className="h-6 w-6" style={{color: '#009688'}} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Informations de l'Officine</h1>
              <p className="text-gray-600">Étape 1/3 - Renseignements administratifs</p>
            </div>
          </div>

          <form onSubmit={handlePharmacySubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dénomination de l'officine *
              </label>
              <input
                type="text"
                required
                value={pharmacyInfo.name}
                onChange={(e) => setPharmacyInfo({...pharmacyInfo, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° Autorisation de rachat <span className="text-gray-500 text-xs">(si concerné)</span>
                </label>
                <input
                  type="text"
                  value={pharmacyInfo.purchaseAuthNumber}
                  onChange={(e) => setPharmacyInfo({...pharmacyInfo, purchaseAuthNumber: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° Quitus d'ouverture <span className="text-gray-500 text-xs">(si concerné)</span>
                </label>
                <input
                  type="text"
                  value={pharmacyInfo.openingQuitus}
                  onChange={(e) => setPharmacyInfo({...pharmacyInfo, openingQuitus: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                N° Autorisation d'exercice en clientèle privée *
              </label>
              <input
                type="text"
                required
                value={pharmacyInfo.privateClienteleAuth}
                onChange={(e) => setPharmacyInfo({...pharmacyInfo, privateClienteleAuth: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation du site *
                </label>
                <input
                  type="text"
                  required
                  value={pharmacyInfo.location}
                  onChange={(e) => setPharmacyInfo({...pharmacyInfo, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut de l'établissement *
                </label>
                <select
                  required
                  value={pharmacyInfo.status}
                  onChange={(e) => setPharmacyInfo({...pharmacyInfo, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="">Sélectionner...</option>
                  <option value="privee">Pharmacie privée</option>
                  <option value="publique">Pharmacie publique</option>
                  <option value="mixte">Pharmacie mixte</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email de l'officine *
              </label>
              <input
                type="email"
                required
                value={pharmacyInfo.email}
                onChange={(e) => setPharmacyInfo({...pharmacyInfo, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-200"
              style={{backgroundColor: '#009688'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
            >
              Continuer vers les informations du titulaire
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'pharmacist') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-lg" style={{backgroundColor: '#e0f2f1'}}>
              <User className="h-6 w-6" style={{color: '#009688'}} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Informations du Titulaire</h1>
              <p className="text-gray-600">Étape 2/3 - Renseignements du pharmacien</p>
            </div>
          </div>

          <form onSubmit={handlePharmacistSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={pharmacistInfo.firstName}
                  onChange={(e) => setPharmacistInfo({...pharmacistInfo, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={pharmacistInfo.lastName}
                  onChange={(e) => setPharmacistInfo({...pharmacistInfo, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro d'inscription à l'ordre *
              </label>
              <input
                type="text"
                required
                value={pharmacistInfo.orderNumber}
                onChange={(e) => setPharmacistInfo({...pharmacistInfo, orderNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={pharmacistInfo.email}
                  onChange={(e) => setPharmacistInfo({...pharmacistInfo, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={pharmacistInfo.phone}
                  onChange={(e) => setPharmacistInfo({...pharmacistInfo, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('pharmacy')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                style={{backgroundColor: '#009688'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
              >
                Commencer l'inspection
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Auto-inspection - {categories[currentCategory]}
            </h1>
            <p className="text-gray-600">Étape 3/3 - Vérification de conformité</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-2">Progression</div>
            <div className="text-lg font-semibold" style={{color: '#009688'}}>
              {getAnsweredCount()}/{inspectionItems.length} éléments
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{backgroundColor: '#009688', width: `${(getAnsweredCount() / inspectionItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => {
            const categoryItems = getItemsByCategory(category);
            const categoryAnswers = answers.filter(a => 
              categoryItems.some(item => item.id === a.itemId)
            );
            const isComplete = categoryAnswers.length === categoryItems.length;
            
            return (
              <button
                key={category}
                onClick={() => setCurrentCategory(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentCategory === index
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={currentCategory === index ? {backgroundColor: '#009688'} : {}}
              >
                <span>{category}</span>
                {isComplete && <CheckCircle className="h-4 w-4" />}
                <span className="text-xs">
                  ({categoryAnswers.length}/{categoryItems.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspection Items */}
      <div className="space-y-6">
        {currentCategoryItems.map((item, index) => {
          const answer = answers.find(a => a.itemId === item.id);
          const StatusIcon = getStatusIcon(answer?.status || '');
          
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium px-2.5 py-0.5 rounded-full" style={{backgroundColor: '#e0f2f1', color: '#009688'}}>
                      {categories[currentCategory]} - {index + 1}
                    </span>
                    {answer && (
                      <div className={`p-1 rounded-full ${getStatusColor(answer.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {item.description}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    <strong>Exigence :</strong> {item.requirement}
                  </p>
                </div>
              </div>

              {/* Status Selection */}
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'compliant', label: 'Conforme', icon: CheckCircle, color: 'green' },
                    { value: 'non-compliant', label: 'Non conforme', icon: XCircle, color: 'red' },
                    { value: 'not-applicable', label: 'Non applicable', icon: FileText, color: 'gray' }
                  ].map(option => {
                    const OptionIcon = option.icon;
                    const isSelected = answer?.status === option.value;
                    
                    return (
                      <label
                        key={option.value}
                        className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? `border-${option.color}-500 bg-${option.color}-50`
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`status-${item.id}`}
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(item.id, option.value as any)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <OptionIcon className={`h-5 w-5 mr-3 ${
                          isSelected 
                            ? `text-${option.color}-600` 
                            : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          isSelected 
                            ? `text-${option.color}-800` 
                            : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Gap Classification for Non-Compliant */}
              {answer?.status === 'non-compliant' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-3">Classification de l'écart</h4>
                  <div className="space-y-2">
                    {[
                      { 
                        value: 'critical', 
                        label: 'Écart critique', 
                        description: 'Risque significatif (ex: produit dangereux/falsifié)',
                        color: 'red'
                      },
                      { 
                        value: 'major', 
                        label: 'Risque majeur', 
                        description: 'Peut conduire à dispense de produits non conformes',
                        color: 'orange'
                      },
                      { 
                        value: 'minor', 
                        label: 'Écart mineur', 
                        description: 'Écart aux bonnes pratiques sans impact immédiat',
                        color: 'yellow'
                      }
                    ].map(gap => (
                      <label key={gap.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`gap-${item.id}`}
                          value={gap.value}
                          checked={answer?.gapType === gap.value}
                          onChange={() => handleAnswerChange(item.id, 'non-compliant', answer?.comment, gap.value as any)}
                          className="mt-1"
                        />
                        <div>
                          <div className={`font-medium text-${gap.color}-800`}>{gap.label}</div>
                          <div className={`text-sm text-${gap.color}-600`}>{gap.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires et observations
                </label>
                <textarea
                  placeholder="Ajoutez des précisions, contexte ou actions déjà entreprises..."
                  value={answer?.comment || ''}
                  onChange={(e) => {
                    const existingAnswer = answer || { itemId: item.id, status: 'compliant' as const };
                    handleAnswerChange(
                      item.id, 
                      existingAnswer.status, 
                      e.target.value, 
                      existingAnswer.gapType
                    );
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  rows={3}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentCategory(Math.max(0, currentCategory - 1))}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentCategory === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={!canComplete()}
            >
              <ClipboardCheck className="h-4 w-4" />
              Catégorie précédente
              <span className="text-xs ml-2">({getAnsweredCount()}/{inspectionItems.length})</span>
            </button>
            
            {currentCategory < categories.length - 1 ? (
              <button
                onClick={() => setCurrentCategory(currentCategory + 1)}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                style={{backgroundColor: '#009688'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
              >
                Catégorie suivante
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canComplete()}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  canComplete()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Terminer l'inspection
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Catégorie {currentCategory + 1} sur {categories.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionForm;