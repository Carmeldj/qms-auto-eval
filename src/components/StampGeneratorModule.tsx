import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import StampPreview from './StampPreview';

interface StampGeneratorModuleProps {
  onBack: () => void;
}

const StampGeneratorModule: React.FC<StampGeneratorModuleProps> = ({ onBack }) => {
  const [pharmacyName, setPharmacyName] = useState<string>('');
  const [stampSize, setStampSize] = useState<number>(200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#009688' }}>
            Générateur de Cachet
          </h1>
          <p className="text-gray-600">
            Créez automatiquement un cachet officiel circulaire pour votre pharmacie
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Configuration */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la pharmacie *
                </label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  placeholder="Ex: Pharmacie Centrale de la Gare"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Le dernier mot sera affiché au centre du cachet
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille du cachet: {stampSize}px
                </label>
                <input
                  type="range"
                  min="150"
                  max="300"
                  step="10"
                  value={stampSize}
                  onChange={(e) => setStampSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>150px</span>
                  <span>300px</span>
                </div>
              </div>

              {/* Informations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-sm text-blue-900 mb-2">ℹ️ Comment ça fonctionne ?</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Le nom de la pharmacie apparaît tout autour du cachet</li>
                  <li>• Le dernier mot du nom est affiché au centre en horizontal</li>
                  <li>• Le cachet est généré au format rouge officiel</li>
                  <li>• Effet d'usure automatique pour un rendu réaliste</li>
                </ul>
              </div>

              {/* Exemples */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-2">📋 Exemples</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setPharmacyName('Pharmacie Centrale')}
                    className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    Pharmacie Centrale
                  </button>
                  <button
                    onClick={() => setPharmacyName('Pharmacie de la Gare')}
                    className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    Pharmacie de la Gare
                  </button>
                  <button
                    onClick={() => setPharmacyName('Pharmacie du Centre Ville')}
                    className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    Pharmacie du Centre Ville
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu</h2>
              <StampPreview pharmacyName={pharmacyName} size={stampSize} />

              {pharmacyName.trim() && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    ✓ Cachet généré avec succès ! Vous pouvez le télécharger ou l'utiliser directement dans vos procédures et registres.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Utilisation dans l'application</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Dans les Procédures</h3>
              <p className="text-sm text-gray-600">
                Lors de la création d'une procédure, accédez à l'onglet "Signatures" et cliquez sur
                "Générer cachet" pour créer automatiquement un cachet avec le nom de votre pharmacie.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Dans les Registres</h3>
              <p className="text-sm text-gray-600">
                Dans les registres de traçabilité, utilisez le bouton "Générer cachet" dans la section
                de validation pour apposer votre cachet officiel sur les documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampGeneratorModule;
