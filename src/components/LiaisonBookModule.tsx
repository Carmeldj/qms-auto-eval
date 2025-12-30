import React, { useState } from 'react';
import { ArrowLeft, Download, MessageCircle, AlertCircle, CheckCircle, BookOpen, Upload, X } from 'lucide-react';
import { shareToWhatsApp } from '../services/WhatsAppService';

interface LiaisonBookFormData {
  pharmacyName: string;
  date: string;
  time: string;
  author: string;
  recipients: string;
  priority: string;
  category: string;
  subject: string;
  message: string;
  actionRequired: string;
  deadline?: string;
}

const LiaisonBookModule: React.FC = () => {
  const [formData, setFormData] = useState<LiaisonBookFormData>({
    pharmacyName: '',
    date: '',
    time: '',
    author: '',
    recipients: '',
    priority: '',
    category: '',
    subject: '',
    message: '',
    actionRequired: '',
    deadline: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [attachedPDF, setAttachedPDF] = useState<File | null>(null);

  const handleInputChange = (field: keyof LiaisonBookFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePDFAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier ne doit pas dépasser 10 MB');
        return;
      }
      setAttachedPDF(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachedPDF(null);
  };

  const isFormValid = () => {
    return (
      formData.pharmacyName.trim() &&
      formData.date &&
      formData.time.trim() &&
      formData.author.trim() &&
      formData.recipients &&
      formData.priority &&
      formData.category &&
      formData.subject.trim() &&
      formData.message.trim() &&
      formData.actionRequired
    );
  };

  const handleShareToWhatsApp = async () => {
    if (!isFormValid()) return;
    setIsSharing(true);

    const template = {
      id: 'liaison-book',
      name: 'Cahier de Liaison',
      category: 'Communication'
    };

    const document = {
      id: Date.now().toString(),
      code: 'CL',
      version: '1.0',
      templateId: 'liaison-book',
      data: formData,
      createdAt: new Date().toISOString()
    };

    try {
      await shareToWhatsApp(template, document as any, formData as any, attachedPDF || undefined);
    } catch (error: any) {
      console.error('Erreur partage WhatsApp:', error);
      const errorMessage = error.message || 'Erreur lors du partage WhatsApp. Veuillez réessayer.';
      alert(errorMessage);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!isFormValid()) return;
    setIsGenerating(true);

    try {
      // Import dynamique du service pour éviter les problèmes de dépendances circulaires
      const { downloadLiaisonBookPDF } = await import('../services/WhatsAppService');
      downloadLiaisonBookPDF(formData as any, 'CL-v1.0');
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const priorityOptions = ['Information', 'Important', 'Urgent', 'Très urgent'];
  const categoryOptions = [
    'Information générale',
    'Procédure',
    'Stock',
    'Client',
    'Fournisseur',
    'Maintenance',
    'Formation',
    'Réglementation',
    'Autre'
  ];
  const recipientsOptions = [
    "Toute l'équipe",
    'Pharmaciens',
    'Auxiliaires en pharmacie',
    'Vendeurs',
    'Équipe du matin',
    "Équipe de l'après-midi",
    'Personne spécifique'
  ];
  const actionRequiredOptions = [
    'Aucune',
    'Prise de connaissance',
    'Action à effectuer',
    'Réponse attendue'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
        </div>

        {/* Title Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cahier de Liaison</h1>
              <p className="text-gray-600">Communication interne entre équipes</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleShareToWhatsApp}
              disabled={!isFormValid() || isSharing}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isFormValid() && !isSharing
                  ? 'bg-[#25D366] text-white hover:bg-[#20BA5A] shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isSharing ? 'Partage...' : 'Partager sur WhatsApp'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={!isFormValid() || isGenerating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isFormValid() && !isGenerating
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-5 w-5" />
              <span>{isGenerating ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Info Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <MessageCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📱 Partage WhatsApp activé <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">NOUVEAU</span>
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Comment ça marche :</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">1.</span>
                  <span>Remplissez tous les champs du formulaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">2.</span>
                  <span>Cliquez sur "Partager sur WhatsApp"</span>
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
              <h4 className="font-semibold text-gray-900 mb-3">Aperçu du message :</h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-xs space-y-1">
                <div className="font-bold">📋 *CAHIER DE LIAISON*</div>
                <div className="text-gray-600">━━━━━━━━━━━━━━━━━</div>
                <div>🏥 *Pharmacie Exemple*</div>
                <div>📅 {new Date().toLocaleDateString('fr-FR')} à 10:00</div>
                <div>✍️ Auteur: Dr. Martin</div>
                <div className="text-gray-600">...</div>
                <div>📄 *Document PDF:* [lien]</div>
                <div className="italic text-gray-500">_Généré par PHARMA QMS_</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informations du cahier de liaison</h2>

          <div className="space-y-6">
            {/* Pharmacie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la pharmacie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pharmacyName}
                onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
                placeholder="Nom de l'officine"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Auteur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auteur du message <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Nom de la personne"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Destinataires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinataires <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.recipients}
                onChange={(e) => handleInputChange('recipients', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Sélectionner...</option>
                {recipientsOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Priorité et Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Sélectionner...</option>
                  {priorityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Sélectionner...</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Objet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Sujet du message"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Contenu du message"
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Action requise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action requise <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.actionRequired}
                onChange={(e) => handleInputChange('actionRequired', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Sélectionner...</option>
                {actionRequiredOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Échéance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéance (si applicable)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Pièce jointe PDF */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document PDF en pièce jointe (optionnel)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Vous pouvez joindre un document PDF supplémentaire à partager avec le cahier de liaison (max 10 MB)
              </p>

              {!attachedPDF ? (
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                  <Upload className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Cliquez pour ajouter un fichier PDF</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePDFAttachment}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachedPDF.name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachedPDF.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveAttachment}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Supprimer la pièce jointe"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            {isFormValid() ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Document prêt à être généré
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

        {/* Action Buttons Bottom */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleShareToWhatsApp}
            disabled={!isFormValid() || isSharing}
            className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
              isFormValid() && !isSharing
                ? 'bg-[#25D366] text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-[#20BA5A]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span>
              {isSharing ? 'Partage en cours...' : 'Partager sur WhatsApp'}
            </span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={!isFormValid() || isGenerating}
            className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
              isFormValid() && !isGenerating
                ? 'bg-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-teal-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Download className="h-5 w-5" />
            <span>
              {isGenerating ? 'Génération en cours...' : 'Télécharger le PDF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiaisonBookModule;
