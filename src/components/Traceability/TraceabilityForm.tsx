import React, { useState } from 'react';
import { Save, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { TraceabilityTemplate } from '../../types/traceability';
import { traceabilityService } from '../../services/TraceabilityService';

interface TraceabilityFormProps {
  template: TraceabilityTemplate;
  onCancel: () => void;
}

const TraceabilityForm: React.FC<TraceabilityFormProps> = ({ template, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

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
      data: formData,
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
    <div className="max-w-4xl mx-auto px-4 py-8">
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