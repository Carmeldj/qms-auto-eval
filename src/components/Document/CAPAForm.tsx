import React, { useState } from 'react';
import { X, Plus, Trash2, Download, AlertCircle } from 'lucide-react';
import { CAPAAction, CAPAFormData, capaService } from '../../services/CAPAService';

interface CAPAFormProps {
  onCancel: () => void;
}

const CAPAForm: React.FC<CAPAFormProps> = ({ onCancel }) => {
  const [pharmacyName, setPharmacyName] = useState('');
  const [dateCreation, setDateCreation] = useState(new Date().toISOString().split('T')[0]);
  const [responsableQualite, setResponsableQualite] = useState('');
  const [periode, setPeriode] = useState('');
  const [actions, setActions] = useState<CAPAAction[]>([
    {
      id: '1',
      probleme: '',
      cause: '',
      actionCorrective: '',
      actionPreventive: '',
      responsable: '',
      delai: '',
      statut: 'En cours',
      verification: ''
    }
  ]);

  const addAction = () => {
    const newAction: CAPAAction = {
      id: Date.now().toString(),
      probleme: '',
      cause: '',
      actionCorrective: '',
      actionPreventive: '',
      responsable: '',
      delai: '',
      statut: 'En cours',
      verification: ''
    };
    setActions([...actions, newAction]);
  };

  const removeAction = (id: string) => {
    if (actions.length > 1) {
      setActions(actions.filter(a => a.id !== id));
    }
  };

  const updateAction = (id: string, field: keyof CAPAAction, value: string) => {
    setActions(actions.map(action =>
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

  const handleGenerate = () => {
    if (!pharmacyName || !responsableQualite || !periode) {
      alert('Veuillez remplir tous les champs obligatoires (Nom pharmacie, Responsable qualité, Période)');
      return;
    }

    const formData: CAPAFormData = {
      pharmacyName,
      dateCreation,
      responsableQualite,
      periode,
      actions
    };

    capaService.generateCAPA(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Plan CAPA
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Actions Correctives et Préventives
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Retour</span>
          </button>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la pharmacie *
            </label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              placeholder="Nom de l'officine"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de création *
            </label>
            <input
              type="date"
              value={dateCreation}
              onChange={(e) => setDateCreation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable Qualité *
            </label>
            <input
              type="text"
              value={responsableQualite}
              onChange={(e) => setResponsableQualite(e.target.value)}
              placeholder="Nom du responsable qualité"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période concernée *
            </label>
            <input
              type="text"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              placeholder="Ex: Q1 2025, Janvier-Mars 2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        {/* Actions CAPA */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Actions CAPA ({actions.length})
            </h2>
            <button
              onClick={addAction}
              className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une action</span>
            </button>
          </div>

          <div className="space-y-6">
            {actions.map((action, index) => (
              <div key={action.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-800">
                    Action CAPA #{index + 1}
                  </h3>
                  {actions.length > 1 && (
                    <button
                      onClick={() => removeAction(action.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problème identifié
                    </label>
                    <textarea
                      value={action.probleme}
                      onChange={(e) => updateAction(action.id, 'probleme', e.target.value)}
                      placeholder="Description du problème ou dysfonctionnement identifié"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cause racine
                    </label>
                    <textarea
                      value={action.cause}
                      onChange={(e) => updateAction(action.id, 'cause', e.target.value)}
                      placeholder="Analyse de la cause racine du problème"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action corrective
                    </label>
                    <textarea
                      value={action.actionCorrective}
                      onChange={(e) => updateAction(action.id, 'actionCorrective', e.target.value)}
                      placeholder="Action pour corriger le problème existant"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action préventive
                    </label>
                    <textarea
                      value={action.actionPreventive}
                      onChange={(e) => updateAction(action.id, 'actionPreventive', e.target.value)}
                      placeholder="Action pour prévenir la récurrence"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsable
                    </label>
                    <input
                      type="text"
                      value={action.responsable}
                      onChange={(e) => updateAction(action.id, 'responsable', e.target.value)}
                      placeholder="Nom du responsable de l'action"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Délai
                    </label>
                    <input
                      type="text"
                      value={action.delai}
                      onChange={(e) => updateAction(action.id, 'delai', e.target.value)}
                      placeholder="Ex: 30/12/2025, 2 semaines"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={action.statut}
                      onChange={(e) => updateAction(action.id, 'statut', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Planifiée">Planifiée</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminée">Terminée</option>
                      <option value="Reportée">Reportée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vérification/Efficacité
                    </label>
                    <input
                      type="text"
                      value={action.verification}
                      onChange={(e) => updateAction(action.id, 'verification', e.target.value)}
                      placeholder="Méthode de vérification de l'efficacité"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleGenerate}
            className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Générer le PDF</span>
          </button>
        </div>

        {/* Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Conseils pour remplir le Plan CAPA :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Identifiez clairement chaque problème rencontré</li>
                <li>Analysez les causes racines avec méthode (5 Pourquoi, Ishikawa...)</li>
                <li>Distinguez bien actions correctives (traiter le problème) et préventives (éviter la récurrence)</li>
                <li>Assignez un responsable précis pour chaque action</li>
                <li>Fixez des délais réalistes et mesurables</li>
                <li>Prévoyez une méthode de vérification de l'efficacité</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAPAForm;
