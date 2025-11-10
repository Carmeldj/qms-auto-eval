import React, { useState, useEffect } from 'react';
import { X, Sparkles, Upload } from 'lucide-react';
import { DocumentTemplate } from '../../types/documents';
import { getQualityPolicyDefault } from '../../data/qualityPolicyDefaults';
import { DocumentService } from '../../services/DocumentService';
import { stampGenerator } from '../../services/StampGenerator';

interface QualityPolicyFormProps {
  template: DocumentTemplate;
  onCancel: () => void;
}

const QualityPolicyForm: React.FC<QualityPolicyFormProps> = ({ template, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showAutoFillInfo, setShowAutoFillInfo] = useState(true);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signatoryName, setSignatoryName] = useState<string>('');
  const [stampImage, setStampImage] = useState<string | null>(null);
  const [showStampGenerator, setShowStampGenerator] = useState(false);
  const [stampPharmacyName, setStampPharmacyName] = useState<string>('');

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

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStampImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateStamp = () => {
    if (!stampPharmacyName.trim()) {
      alert('Veuillez entrer le nom de la pharmacie pour générer le cachet');
      return;
    }
    try {
      const generatedStamp = stampGenerator.generateCustomStamp({
        pharmacyName: stampPharmacyName,
        size: 200,
        centerText: 'PHARMACIEN'
      });
      setStampImage(generatedStamp);
      setShowStampGenerator(false);
    } catch (error) {
      console.error('Erreur lors de la génération du cachet:', error);
      alert('Erreur lors de la génération du cachet');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const documentData = {
      id: `DOC-${Date.now()}`,
      templateId: template.id,
      data: {
        ...formData,
        _signatureImage: signatureImage || '',
        _signatoryName: signatoryName,
        _stampImage: stampImage || ''
      },
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

          {/* Signature Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature du Responsable</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="signatoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du signataire
                </label>
                <input
                  type="text"
                  id="signatoryName"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  placeholder="Ex: Dr. Ahmed BENALI, Pharmacien Titulaire"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importer la signature
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">Choisir une image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                  </label>
                  {signatureImage && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={signatureImage}
                        alt="Signature"
                        className="h-16 border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setSignatureImage(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: PNG, JPG, JPEG. La signature sera affichée en bas de la première page.
                </p>
              </div>
            </div>
          </div>

          {/* Stamp Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cachet de la Pharmacie</h3>

            <div className="space-y-4">
              {/* Generate or Import Stamp */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowStampGenerator(!showStampGenerator)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showStampGenerator ? 'Annuler' : 'Générer un cachet'}
                </button>

                <span className="text-gray-500">ou</span>

                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Importer un cachet</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStampUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Stamp Generator Panel */}
              {showStampGenerator && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label htmlFor="stampPharmacyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la pharmacie pour le cachet
                  </label>
                  <input
                    type="text"
                    id="stampPharmacyName"
                    value={stampPharmacyName}
                    onChange={(e) => setStampPharmacyName(e.target.value)}
                    placeholder="Ex: PHARMACIE CENTRALE"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateStamp}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Créer le cachet
                  </button>
                </div>
              )}

              {/* Stamp Preview */}
              {stampImage && (
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                    <img
                      src={stampImage}
                      alt="Cachet"
                      className="h-24 w-24"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStampImage(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Le cachet sera affiché à côté de la signature en bas de la première page.
              </p>
            </div>
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
