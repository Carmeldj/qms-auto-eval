import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { DocumentTemplate } from '../../types/documents';
import { getQualityPolicyDefault } from '../../data/qualityPolicyDefaults';
import { DocumentService } from '../../services/DocumentService';

interface QualityPolicyFormProps {
  template: DocumentTemplate;
  onCancel: () => void;
}

const QualityPolicyForm: React.FC<QualityPolicyFormProps> = ({ template, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showAutoFillInfo, setShowAutoFillInfo] = useState(true);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  useEffect(() => {
    const initialData: Record<string, string> = {};
    template.fields.forEach(field => {
      initialData[field.id] = '';
    });
    setFormData(initialData);
  }, [template]);

  const handleAutoFill = () => {
    const defaults = getQualityPolicyDefault();
    setFormData({
      ...formData,
      vision: defaults.vision,
      values: defaults.values,
      missions: defaults.missions,
      means: defaults.means,
      strategicAxes: defaults.strategicAxes
    });
    setShowAutoFillInfo(false);
    setHasAutoFilled(true);
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const documentData = {
      id: `DOC-${Date.now()}`,
      templateId: template.id,
      data: formData,
      createdAt: new Date().toISOString()
    };

    DocumentService.getInstance().generatePDF(template, documentData);
    onCancel();
  };

  const renderField = (field: typeof template.fields[0]) => {
    const value = formData[field.id] || '';

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.id}
          value={value}
          onChange={(e) => handleChange(field.id, e.target.value)}
          required={field.required}
          rows={field.rows || 4}
          placeholder={field.placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      );
    }

    return (
      <input
        type={field.type}
        id={field.id}
        value={value}
        onChange={(e) => handleChange(field.id, e.target.value)}
        required={field.required}
        placeholder={field.placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{template.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            {!hasAutoFilled && (
              <button
                type="button"
                onClick={handleAutoFill}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Auto-remplissage</span>
              </button>
            )}
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Info bulle auto-remplissage */}
        {showAutoFillInfo && !hasAutoFilled && (
          <div className="mx-4 sm:mx-6 mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-1">💡 Modèle de Politique Qualité disponible !</h4>
                <p className="text-sm text-purple-700">
                  Cliquez sur <span className="font-semibold">Auto-remplissage</span> pour charger un modèle complet de politique qualité conforme aux normes pharmaceutiques.
                  Vous pourrez ensuite personnaliser chaque section selon les spécificités de votre officine.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success message after auto-fill */}
        {hasAutoFilled && (
          <div className="mx-4 sm:mx-6 mt-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">✓ Modèle chargé avec succès !</h4>
                <p className="text-sm text-green-700">
                  Vous pouvez maintenant personnaliser chaque section selon votre officine. N'oubliez pas de remplir le nom de la pharmacie et les dates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {template.fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {field.id === 'pharmacyName' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Le nom de votre officine apparaîtra en haut du document
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
            >
              Générer le PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QualityPolicyForm;
