import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, TrendingUp, Target, Download, Edit2, Trash2, Eye, Calendar, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import { defaultIndicators } from '../data/defaultIndicators';

interface Indicator {
  id?: string;
  name: string;
  implementation_date: string;
  theme: string;
  objective: string;
  definition: string;
  formula: string;
  unit: string;
  frequency: string;
  source: string;
  collection_responsible: string;
  alert_thresholds: string;
  actions_to_consider: string;
  decision_responsible: string;
  communication: string;
  created_at?: string;
}

const IndicatorsReviewModule: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Indicator>({
    name: '',
    implementation_date: '',
    theme: '',
    objective: '',
    definition: '',
    formula: '',
    unit: '',
    frequency: '',
    source: '',
    collection_responsible: '',
    alert_thresholds: '',
    actions_to_consider: '',
    decision_responsible: '',
    communication: ''
  });

  useEffect(() => {
    loadIndicators();
  }, []);

  const loadIndicators = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('indicators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIndicators(data || []);
    } catch (error) {
      console.error('Erreur chargement indicateurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Indicator, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedIndicator?.id) {
        // Update
        const { error } = await supabase
          .from('indicators')
          .update(formData)
          .eq('id', selectedIndicator.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('indicators')
          .insert([formData]);

        if (error) throw error;
      }

      await loadIndicators();
      resetForm();
      alert('Indicateur sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    setFormData(indicator);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet indicateur ?')) return;

    try {
      const { error } = await supabase
        .from('indicators')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadIndicators();
      alert('Indicateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      implementation_date: '',
      theme: '',
      objective: '',
      definition: '',
      formula: '',
      unit: '',
      frequency: '',
      source: '',
      collection_responsible: '',
      alert_thresholds: '',
      actions_to_consider: '',
      decision_responsible: '',
      communication: ''
    });
    setSelectedIndicator(null);
    setShowForm(false);
  };

  const handleInitializeDefaults = async () => {
    if (!confirm('Voulez-vous initialiser les indicateurs par défaut ? Cela ajoutera tous les indicateurs standards des procédures.')) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const indicatorsToInsert = defaultIndicators.map(indicator => ({
        ...indicator,
        implementation_date: today
      }));

      const { error } = await supabase
        .from('indicators')
        .insert(indicatorsToInsert);

      if (error) throw error;

      await loadIndicators();
      alert(`${defaultIndicators.length} indicateurs initialisés avec succès !`);
    } catch (error) {
      console.error('Erreur initialisation:', error);
      alert('Erreur lors de l\'initialisation des indicateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = (indicator: Indicator) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Background color light green
    pdf.setFillColor(220, 240, 220);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header with icon and title
    pdf.setFillColor(180, 220, 180);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 3, 3, 'F');

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(indicator.name, pageWidth / 2, yPos + 12, { align: 'center' });
    yPos += 25;

    // Date
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date de mise en place : ${new Date(indicator.implementation_date).toLocaleDateString('fr-FR')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    const addSection = (label: string, content: string, icon?: string) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        pdf.setFillColor(220, 240, 220);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = margin;
      }

      // Section box
      const boxHeight = pdf.getTextDimensions(content, { maxWidth: pageWidth - 2 * margin - 4 }).h + 8;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(100, 150, 100);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 2, 2, 'FD');

      // Label
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(label + ' :', margin + 3, yPos + 5);

      // Content
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(content, pageWidth - 2 * margin - 6);
      pdf.text(lines, margin + 3, yPos + 11);

      yPos += boxHeight + 3;
    };

    addSection('Thématique', indicator.theme);
    addSection('Objectif', indicator.objective);
    addSection('Définition', indicator.definition);

    // Formula and Unit on same line
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      pdf.setFillColor(220, 240, 220);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin;
    }

    const halfWidth = (pageWidth - 2 * margin - 2) / 2;

    // Formula box
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(100, 150, 100);
    pdf.roundedRect(margin, yPos, halfWidth, 15, 2, 2, 'FD');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Formule :', margin + 3, yPos + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(indicator.formula, margin + 3, yPos + 10);

    // Unit box
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin + halfWidth + 2, yPos, halfWidth, 15, 2, 2, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.text('Unité :', margin + halfWidth + 5, yPos + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(indicator.unit, margin + halfWidth + 5, yPos + 10);
    yPos += 18;

    addSection('Fréquence', indicator.frequency);
    addSection('Source', indicator.source);
    addSection('Responsable de collecte', indicator.collection_responsible);
    addSection('Seuils d\'alerte', indicator.alert_thresholds);
    addSection('Actions à envisager', indicator.actions_to_consider);
    addSection('Responsable(s) de décision', indicator.decision_responsible);
    addSection('Communication à prévoir', indicator.communication);

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Généré par PHARMA QMS', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save(`indicateur-${indicator.name.replace(/\s+/g, '-')}.pdf`);
  };

  const frequencyOptions = ['Quotidienne', 'Hebdomadaire', 'Mensuelle', 'Trimestrielle', 'Semestrielle', 'Annuelle'];
  const unitOptions = ['nombre', 'pourcentage (%)', 'heures', 'FCFA', 'jours', 'autre'];

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={resetForm}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à la liste</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedIndicator ? 'Modifier l\'indicateur' : 'Nouvel indicateur'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'indicateur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ex: Taux de satisfaction client"
                />
              </div>

              {/* Date de mise en place */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de mise en place <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.implementation_date}
                  onChange={(e) => handleInputChange('implementation_date', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Thématique */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thématique <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Processus ou sous-processus en lien avec la cartographie"
                />
              </div>

              {/* Objectif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectif <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Pourquoi le suit-on ? Que permet-il de suivre ? Quel enjeu pour la structure ?"
                />
              </div>

              {/* Définition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Définition <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.definition}
                  onChange={(e) => handleInputChange('definition', e.target.value)}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Ce que mesure précisément l'indicateur, ce qu'il inclut et exclut"
                />
              </div>

              {/* Formule et Unité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formule <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.formula}
                    onChange={(e) => handleInputChange('formula', e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Formule de calcul claire"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Sélectionner...</option>
                    {unitOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fréquence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Sélectionner...</option>
                  {frequencyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Où récupérer l'information"
                />
              </div>

              {/* Responsable de collecte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsable de collecte <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.collection_responsible}
                  onChange={(e) => handleInputChange('collection_responsible', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Qui est chargé de récupérer les données"
                />
              </div>

              {/* Seuils d'alerte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seuils d'alerte <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.alert_thresholds}
                  onChange={(e) => handleInputChange('alert_thresholds', e.target.value)}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Valeurs acceptables / seuils critiques"
                />
              </div>

              {/* Actions à envisager */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions à envisager <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.actions_to_consider}
                  onChange={(e) => handleInputChange('actions_to_consider', e.target.value)}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Mesures potentielles à mettre en place, non exhaustives"
                />
              </div>

              {/* Responsable de décision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsable(s) de décision <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.decision_responsible}
                  onChange={(e) => handleInputChange('decision_responsible', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Qui (personne ou instance) est chargé d'analyser et de décider des mesures"
                />
              </div>

              {/* Communication */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication à prévoir <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.communication}
                  onChange={(e) => handleInputChange('communication', e.target.value)}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Instances ou catégories de professionnels ou partenaires extérieurs à informer"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Revue des Indicateurs</h1>
                <p className="text-gray-600">Gestion des indicateurs de performance</p>
              </div>
            </div>
            <div className="flex gap-3">
              {indicators.length === 0 && (
                <button
                  onClick={handleInitializeDefaults}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  <Database className="h-5 w-5" />
                  <span>Charger indicateurs par défaut</span>
                </button>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Nouvel indicateur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Conseil :</strong> Les indicateurs permettent de suivre la performance de vos processus.
            Chaque fiche génère un PDF conforme au modèle standard de revue des indicateurs.
            {indicators.length === 0 && (
              <span className="block mt-2">
                <strong>🎯 Démarrage rapide :</strong> Cliquez sur "Charger indicateurs par défaut" pour initialiser automatiquement tous les indicateurs standards des procédures (52 indicateurs).
              </span>
            )}
          </p>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        ) : indicators.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun indicateur</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre premier indicateur de performance</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700"
            >
              <Plus className="h-5 w-5" />
              <span>Créer un indicateur</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicators.map((indicator) => (
              <div key={indicator.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{indicator.name}</h3>
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded ml-2">
                        📅 {indicator.frequency}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(indicator.implementation_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Thématique:</strong> {indicator.theme}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-teal-600 flex-shrink-0" />
                </div>

                <div className="border-t pt-4 flex gap-2">
                  <button
                    onClick={() => generatePDF(indicator)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleEdit(indicator)}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(indicator.id!)}
                    className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicatorsReviewModule;
