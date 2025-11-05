import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, FileText, Download, ExternalLink } from 'lucide-react';
import { PrescriptionFileService } from '../services/PrescriptionFileService';

interface PrescriptionViewerProps {
  entryId: string;
  entryLabel: string;
  onClose: () => void;
}

const PrescriptionViewer: React.FC<PrescriptionViewerProps> = ({ entryId, entryLabel, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleAccess = async () => {
    if (!password || password.trim().length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = await PrescriptionFileService.accessPrescriptionFile({
        entryId,
        password
      });

      setFileUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ordonnance</h2>
              <p className="text-sm text-gray-600">{entryLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!fileUrl ? (
            // Authentication Form
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Fichier protégé par mot de passe
                    </h3>
                    <p className="text-sm text-gray-700">
                      Ce fichier d'ordonnance est protégé. Entrez le mot de passe défini lors de l'upload pour y accéder.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAccess();
                      }
                    }}
                    placeholder="Entrez le mot de passe"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 pr-12
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAccess}
                  disabled={loading || password.length < 4}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    loading || password.length < 4
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  <span>{loading ? 'Vérification...' : 'Accéder au fichier'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            // File Access View
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Accès autorisé
                    </h3>
                    <p className="text-sm text-green-700">
                      Le mot de passe est correct. Vous pouvez maintenant consulter le fichier d'ordonnance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-6 text-center space-y-4">
                <FileText className="h-16 w-16 text-blue-600 mx-auto" />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Fichier d'ordonnance disponible</p>
                  <p className="text-xs text-gray-500">{entryLabel}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Ouvrir dans un nouvel onglet</span>
                  </button>
                  <a
                    href={fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <Download className="h-5 w-5" />
                    <span>Télécharger</span>
                  </a>
                </div>

                {/* Lien direct cliquable */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Ou cliquez sur le lien direct ci-dessous :
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium break-all"
                  >
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    <span>Cliquer ici pour ouvrir/télécharger l'ordonnance</span>
                  </a>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    💡 Astuce : Clic droit sur le lien → "Enregistrer sous" pour télécharger directement
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionViewer;
