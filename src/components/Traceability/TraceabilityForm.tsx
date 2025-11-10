import React, { useState } from 'react';
import { Save, X, Download, AlertCircle, CheckCircle, Edit2, Upload } from 'lucide-react';
import { TraceabilityTemplate, TraceabilitySignatures, SignatureData } from '../../types/traceability';
import { traceabilityService } from '../../services/TraceabilityService';

interface TraceabilityFormProps {
  template: TraceabilityTemplate;
  onCancel: () => void;
}

const TraceabilityForm: React.FC<TraceabilityFormProps> = ({ template, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>(template.title);
  const [signatures, setSignatures] = useState<TraceabilitySignatures>({
    recorder: { name: '', date: new Date().toISOString().split('T')[0] },
    verifier: { name: '', date: new Date().toISOString().split('T')[0] },
    approver: { name: '', date: new Date().toISOString().split('T')[0] }
  });

  const handleImageUpload = (file: File, role: 'recorder' | 'verifier' | 'approver') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSignatures(prev => ({
        ...prev,
        [role]: {
          ...prev[role]!,
          signatureImage: base64String
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleStampUpload = (file: File, role: 'recorder' | 'verifier' | 'approver') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSignatures(prev => ({
        ...prev,
        [role]: {
          ...prev[role]!,
          stampImage: base64String
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const generateInitialsSignature = (name: string): string => {
    if (!name.trim()) return '';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      // Nom suivi de la première lettre du prénom
      const lastName = nameParts[nameParts.length - 1];
      const firstNameInitial = nameParts[0][0].toUpperCase();
      return `${lastName} ${firstNameInitial}`;
    }
    return name;
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const isFormValid = () => {
    const requiredFields = template.fields.filter(field => field.required);
    return requiredFields.every(field => formData[field.id]?.trim());
  };

  const handleGeneratePDF = async () => {
    if (!isFormValid()) return;

    const record = {
      id: Date.now().toString(),
      templateId: template.id,
      data: {
        ...formData,
        _customTitle: customTitle
      },
      signatures: signatures,
      createdAt: new Date().toISOString()
    };

    try {
      await traceabilityService.generatePDF(template, record);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
            style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
          >
            <option value="">Sélectionner...</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {template.title}
            </h1>
            <p className="text-gray-600">{template.description}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={!isFormValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isFormValid()
                  ? 'text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={isFormValid() ? {backgroundColor: '#009688'} : {}}
              onMouseEnter={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = '#00796b';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = '#009688';
                }
              }}
            >
              <Download className="h-4 w-4" />
              <span>Générer PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          {/* Title Edit Section */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-900">
                Titre principal du document
              </label>
              <button
                onClick={() => setIsEditingTitle(!isEditingTitle)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>{isEditingTitle ? 'Annuler' : 'Modifier le titre'}</span>
              </button>
            </div>
            {isEditingTitle ? (
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                placeholder="Entrez le titre personnalisé"
              />
            ) : (
              <div className="text-base font-semibold text-gray-900 bg-white rounded-lg px-3 py-2 border border-gray-300">
                {customTitle}
              </div>
            )}
          </div>

          {template.fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      {/* Form Validation Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mt-6">
        <div className="flex items-center space-x-2">
          {isFormValid() ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Formulaire prêt à être généré en PDF</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Veuillez compléter tous les champs obligatoires (*)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Signatures Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Validation et Signatures</h3>
        <div className="space-y-6">
          {/* Enregistré par */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Edit2 className="h-5 w-5" style={{color: '#009688'}} />
              <h4 className="font-bold text-gray-900">Enregistré par</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={signatures.recorder?.name || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    recorder: { ...prev.recorder!, name: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={signatures.recorder?.date || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    recorder: { ...prev.recorder!, date: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature (image)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'recorder');
                  }}
                  className="hidden"
                  id="recorder-signature"
                />
                <label
                  htmlFor="recorder-signature"
                  className="flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-teal-500 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Télécharger une signature</span>
                </label>
                {signatures.recorder?.signatureImage && (
                  <div className="relative border border-gray-300 rounded-lg p-2">
                    <img src={signatures.recorder.signatureImage} alt="Signature" className="max-h-16 mx-auto" />
                    <button
                      onClick={() => setSignatures(prev => ({
                        ...prev,
                        recorder: {
                          ...prev.recorder!,
                          signatureImage: undefined
                        }
                      }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {!signatures.recorder?.signatureImage && signatures.recorder?.name && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Aperçu par défaut :</p>
                    <p className="text-xl font-italic" style={{fontFamily: 'cursive', color: '#0066cc'}}>
                      {generateInitialsSignature(signatures.recorder.name)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vérifié par */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5" style={{color: '#009688'}} />
              <h4 className="font-bold text-gray-900">Vérifié par</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={signatures.verifier?.name || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    verifier: { ...prev.verifier!, name: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={signatures.verifier?.date || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    verifier: { ...prev.verifier!, date: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature (image)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'verifier');
                  }}
                  className="hidden"
                  id="verifier-signature"
                />
                <label
                  htmlFor="verifier-signature"
                  className="flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-teal-500 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Télécharger une signature</span>
                </label>
                {signatures.verifier?.signatureImage && (
                  <div className="relative border border-gray-300 rounded-lg p-2">
                    <img src={signatures.verifier.signatureImage} alt="Signature" className="max-h-16 mx-auto" />
                    <button
                      onClick={() => setSignatures(prev => ({
                        ...prev,
                        verifier: {
                          ...prev.verifier!,
                          signatureImage: undefined
                        }
                      }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {!signatures.verifier?.signatureImage && signatures.verifier?.name && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Aperçu par défaut :</p>
                    <p className="text-xl font-italic" style={{fontFamily: 'cursive', color: '#0066cc'}}>
                      {generateInitialsSignature(signatures.verifier.name)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Approuvé par */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5" style={{color: '#009688'}} />
              <h4 className="font-bold text-gray-900">Approuvé par</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={signatures.approver?.name || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    approver: { ...prev.approver!, name: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={signatures.approver?.date || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    approver: { ...prev.approver!, date: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature (image)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'approver');
                  }}
                  className="hidden"
                  id="approver-signature"
                />
                <label
                  htmlFor="approver-signature"
                  className="flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-teal-500 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Télécharger une signature</span>
                </label>
                {signatures.approver?.signatureImage && (
                  <div className="relative border border-gray-300 rounded-lg p-2">
                    <img src={signatures.approver.signatureImage} alt="Signature" className="max-h-16 mx-auto" />
                    <button
                      onClick={() => setSignatures(prev => ({
                        ...prev,
                        approver: {
                          ...prev.approver!,
                          signatureImage: undefined
                        }
                      }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {!signatures.approver?.signatureImage && signatures.approver?.name && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Aperçu par défaut :</p>
                    <p className="text-xl font-italic" style={{fontFamily: 'cursive', color: '#0066cc'}}>
                      {generateInitialsSignature(signatures.approver.name)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section Cachet pour l'approbateur */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cachet (image)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleStampUpload(file, 'approver');
                  }}
                  className="hidden"
                  id="approver-stamp"
                />
                <label
                  htmlFor="approver-stamp"
                  className="flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-teal-500 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Télécharger un cachet</span>
                </label>
                {signatures.approver?.stampImage && (
                  <div className="relative border border-gray-300 rounded-lg p-2">
                    <img src={signatures.approver.stampImage} alt="Cachet" className="max-h-16 mx-auto" />
                    <button
                      onClick={() => setSignatures(prev => ({
                        ...prev,
                        approver: {
                          ...prev.approver!,
                          stampImage: undefined
                        }
                      }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Generate Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleGeneratePDF}
          disabled={!isFormValid()}
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 mx-auto ${
            isFormValid()
              ? 'text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={isFormValid() ? {backgroundColor: '#009688'} : {}}
          onMouseEnter={(e) => {
            if (isFormValid()) {
              e.currentTarget.style.backgroundColor = '#00796b';
            }
          }}
          onMouseLeave={(e) => {
            if (isFormValid()) {
              e.currentTarget.style.backgroundColor = '#009688';
            }
          }}
        >
          <Download className="h-5 w-5" />
          <span>Générer le Registre PDF</span>
        </button>
      </div>
    </div>
  );
};

export default TraceabilityForm;