import React, { useState } from "react";
import {
  X,
  Download,
  AlertCircle,
  CheckCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import {
  DocumentTemplate,
  DocumentAccessLevel,
  DocumentStatus,
} from "../../types/documents";
import { documentService } from "../../services/DocumentService";
import ClassificationBadge from "../ClassificationBadge";
import { uploadAndSaveDocument } from "../../utils/documentUploadHelper";
import { useAuth } from "../../contexts/AuthContext";
import { shareToWhatsApp } from "../../services/WhatsAppService";

interface DocumentFormProps {
  template: DocumentTemplate;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ template, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pharmacyInitials, setPharmacyInitials] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const isLiaisonBook = template.id === "liaison-book";

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Auto-generate initials when pharmacy name is entered
    if (fieldId === "pharmacyName" && value.trim()) {
      const words = value.trim().split(/\s+/);
      const autoInitials = words
        .map((w) => w[0])
        .join("")
        .substring(0, 3)
        .toUpperCase();
      setPharmacyInitials(autoInitials);

      // const autoInitials = value.replace(/\s+/g, '').substring(0, 3).toUpperCase();
      // setPharmacyInitials(autoInitials);
    }
  };

  const handleInitialsChange = (value: string) => {
    // Allow only uppercase letters, max 3 characters
    const sanitized = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .substring(0, 3);
    setPharmacyInitials(sanitized);
  };

  const isFormValid = () => {
    const requiredFields = template.fields.filter((field) => field.required);
    return requiredFields.every((field) => formData[field.id]?.trim());
  };

  const handleGeneratePDF = async () => {
    if (!isFormValid()) return;
    setIsGenerating(true);

    const documentData = {
      id: Date.now().toString(),
      templateId: template.id,
      data: {
        ...formData,
        _pharmacyInitials: pharmacyInitials, // Store initials for PDF generation
      },
      createdAt: new Date().toISOString(),
    };

    try {
      // Generate PDF blob first
      const result = await documentService.generatePDF(template, documentData);
      const { blob, fileName } = result;

      // Upload and save to API (this already handles the download)
      await uploadAndSaveDocument(blob, fileName, {
        title: template.title,
        type: template.category,
        category: template.category,
        description: template.description,
        author:
          user?.name ||
          user?.email ||
          formData.pharmacyName ||
          "Unknown Author",
        version: "1.0",
        accessLevel: DocumentAccessLevel.RESTRICTED,
        status: DocumentStatus.DRAFT,
        tags: [template.category, template.id],
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareToWhatsApp = async () => {
    if (!isFormValid()) return;
    setIsSharing(true);

    const documentData = {
      id: Date.now().toString(),
      templateId: template.id,
      data: {
        ...formData,
        _pharmacyInitials: pharmacyInitials,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      await shareToWhatsApp(template, documentData, formData);
    } catch (error: any) {
      console.error("Erreur partage WhatsApp:", error);
      const errorMessage =
        error.message || "Erreur lors du partage WhatsApp. Veuillez réessayer.";
      alert(errorMessage);
    } finally {
      setIsSharing(false);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
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
        <div className="flex flex-col md:flex-row items-start justify-between">
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
                  pharmacyInitials={pharmacyInitials}
                  showFullCode={true}
                  size="medium"
                />
              </div>
            )}
          </div>
          <div className="w-full lg:w-max flex items-center gap-3">
            {isLiaisonBook && (
              <button
                onClick={handleShareToWhatsApp}
                disabled={!isFormValid() || isSharing}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  isFormValid() && !isSharing
                    ? "bg-[#25D366] text-white hover:bg-[#20BA5A]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isSharing ? "Partage..." : "WhatsApp"}</span>
              </button>
            )}
            <button
              onClick={handleGeneratePDF}
              disabled={!isFormValid() || isGenerating}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isFormValid() && !isGenerating
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
              <span>{isGenerating ? "Génération..." : "Télécharger PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classification Info Section */}
      {template.classificationCode && (
        <div className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-md p-6 border-2 border-teal-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <span>Classification Documentaire</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initiales de la pharmacie{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pharmacyInitials}
                onChange={(e) => handleInitialsChange(e.target.value)}
                placeholder="Ex: PCG"
                maxLength={3}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent font-bold text-sm uppercase tracking-wider"
                style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
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

      {/* WhatsApp Info Banner - Only for liaison book */}
      {isLiaisonBook && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mt-6">
          <div className="flex items-start gap-3 mb-4">
            <MessageCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📱 Partage WhatsApp activé{" "}
                <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-full">
                  NOUVEAU
                </span>
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Comment ça marche :
              </h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">1.</span>
                  <span>Remplissez tous les champs du formulaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">2.</span>
                  <span>Cliquez sur le bouton "WhatsApp"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">3.</span>
                  <span>Le PDF est généré et uploadé automatiquement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">4.</span>
                  <span>WhatsApp s'ouvre avec le message formaté</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">5.</span>
                  <span>Sélectionnez le groupe et envoyez !</span>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Aperçu du message :
              </h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-xs space-y-1">
                <div className="font-bold">📋 *CAHIER DE LIAISON*</div>
                <div className="text-gray-600">━━━━━━━━━━━━━━━━━</div>
                <div>🏥 *Pharmacie Exemple*</div>
                <div>📅 {new Date().toLocaleDateString("fr-FR")} à 10:00</div>
                <div>✍️ Auteur: Dr. Martin</div>
                <div className="text-gray-600">...</div>
                <div>📄 *Document PDF:* [lien]</div>
                <div className="italic text-gray-500">
                  _Généré par PHARMA QMS_
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        {isLiaisonBook && (
          <button
            onClick={handleShareToWhatsApp}
            disabled={!isFormValid() || isSharing}
            className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
              isFormValid() && !isSharing
                ? "bg-[#25D366] text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-[#20BA5A]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span>
              {isSharing ? "Partage en cours..." : "Partager sur WhatsApp"}
            </span>
          </button>
        )}
        <button
          onClick={handleGeneratePDF}
          disabled={!isFormValid() || isGenerating}
          className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
            isFormValid() && !isGenerating
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
          <span>
            {isGenerating ? "Génération en cours..." : "Télécharger le PDF"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DocumentForm;
