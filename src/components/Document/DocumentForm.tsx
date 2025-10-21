import React, { useState } from "react";
import { X, Download, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { DocumentTemplate } from "../../types/documents";
import { documentService } from "../../services/DocumentService";
import ClassificationBadge from '../ClassificationBadge';

interface DocumentFormProps {
  template: DocumentTemplate;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ template, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pharmacyInitials, setPharmacyInitials] = useState<string>('');

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Auto-generate initials when pharmacy name is entered
    if (fieldId === 'pharmacyName' && value.trim()) {
      const words = value.trim().split(/\s+/);
      const autoInitials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
      setPharmacyInitials(autoInitials);
    }
  };

  const handleInitialsChange = (value: string) => {
    // Allow only uppercase letters, max 3 characters
    const sanitized = value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 3);
    setPharmacyInitials(sanitized);
  };


  const isFormValid = () => {
    const requiredFields = template.fields.filter((field) => field.required);
    return requiredFields.every((field) => formData[field.id]?.trim());
  };

  const handleGeneratePDF = async () => {
    if (!isFormValid()) return;

    const document = {
      id: Date.now().toString(),
      templateId: template.id,
      data: formData,
      createdAt: new Date().toISOString(),
    };

    try {
      await documentService.generatePDF(template, document);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF");
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.id] || "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
            rows={field.rows || 4}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
          >
            <option value="">Sélectionner...</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
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
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 w-full ">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          <X className="h-4 w-4" />
          <span>Retour</span>
        </button>
      </div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {template.title}
            </h1>
            <p className="text-gray-600">{template.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Temps estimé : {template.estimatedTime}
            </p>
            {template.classificationCode && (
              <div className="mt-3">
                <ClassificationBadge
                  classificationCode={template.classificationCode}
                  pharmacyInitials={formData.pharmacyName ? formData.pharmacyName.split(' ').map(w => w[0]).join('').substring(0, 3) : ''}
                  size="small"
                />
              </div>
            )}
          </div>
          <div className="mt-4 w-full lg:w-max flex items-center justify-between">

            <button
              onClick={handleGeneratePDF}
              disabled={!isFormValid()}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${isFormValid()
                ? "text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              style={isFormValid() ? { backgroundColor: "#009688" } : {}}
              onMouseEnter={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = "#00796b";
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = "#009688";
                }
              }}
            >
              <Download className="h-4 w-4" />
              <span>Générer PDF</span>
            </button>
          </div>
        </div>
      </div>

       {/* Classification Info Section */}
      {template.classificationCode && (
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-md p-6 border-2 border-teal-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <span>Classification Documentaire</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initiales de la pharmacie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pharmacyInitials}
                onChange={(e) => handleInitialsChange(e.target.value)}
                placeholder="Ex: PCG"
                maxLength={3}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent font-bold text-lg uppercase tracking-wider"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-1">
                3 lettres maximum - Généré automatiquement à partir du nom
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de classification
              </label>
              <div className="bg-white border-2 border-teal-300 rounded-lg px-4 py-3">
                <ClassificationBadge
                  classificationCode={template.classificationCode}
                  pharmacyInitials={pharmacyInitials}
                  showFullCode={true}
                  size="medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          {template.fields.map((field) => (
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
              <span className="text-green-800 font-medium">
                Document prêt à être généré en PDF
              </span>
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
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 mx-auto ${isFormValid()
            ? "text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          style={isFormValid() ? { backgroundColor: "#009688" } : {}}
          onMouseEnter={(e) => {
            if (isFormValid()) {
              e.currentTarget.style.backgroundColor = "#00796b";
            }
          }}
          onMouseLeave={(e) => {
            if (isFormValid()) {
              e.currentTarget.style.backgroundColor = "#009688";
            }
          }}
        >
          <Download className="h-5 w-5" />
          <span>Générer le Document PDF</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentForm;
