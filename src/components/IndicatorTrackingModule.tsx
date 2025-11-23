import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, TrendingUp, AlertCircle, CheckCircle, AlertTriangle, Download, Edit2, Trash2, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';

interface Indicator {
  id: string;
  name: string;
  theme: string;
  unit: string;
  frequency: string;
  alert_thresholds: string;
}

interface Measurement {
  id?: string;
  indicator_id: string;
  measurement_date: string;
  measured_value: string;
  target_value: string;
  status: 'conforme' | 'alerte' | 'critique';
  comments: string;
  measured_by: string;
  actions_taken: string;
  created_at?: string;
  indicator?: Indicator;
}

const IndicatorTrackingModule: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterIndicator, setFilterIndicator] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<Measurement>({
    indicator_id: '',
    measurement_date: '',
    measured_value: '',
    target_value: '',
    status: 'conforme',
    comments: '',
    measured_by: '',
    actions_taken: ''
  });

  useEffect(() => {
    loadIndicators();
    loadMeasurements();
  }, []);

  const loadIndicators = async () => {
    try {
      const { data, error } = await supabase
        .from('indicators')
        .select('id, name, theme, unit, frequency, alert_thresholds')
        .order('name');

      if (error) throw error;
      setIndicators(data || []);
    } catch (error) {
      console.error('Erreur chargement indicateurs:', error);
    }
  };

  const loadMeasurements = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('indicator_measurements')
        .select(`
          *,
          indicator:indicators(id, name, theme, unit, frequency, alert_thresholds)
        `)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      setMeasurements(data || []);
    } catch (error) {
      console.error('Erreur chargement mesures:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatus = (measuredValue: string, indicator: Indicator | undefined): 'conforme' | 'alerte' | 'critique' => {
    if (!indicator || !measuredValue || !indicator.alert_thresholds) {
      return 'conforme';
    }

    const thresholds = indicator.alert_thresholds.toLowerCase();
    const numValue = parseFloat(measuredValue.replace(/[^\d.-]/g, ''));

    if (isNaN(numValue)) {
      return 'conforme';
    }

    if (thresholds.includes('critique') && thresholds.includes('acceptable') && thresholds.includes('cible')) {
      if (thresholds.includes('supérieur') || thresholds.includes('≥') || thresholds.includes('>=')) {
        const critiqueMatch = thresholds.match(/critique[:\s]*<?[<\s]*(\d+\.?\d*)/i);
        const acceptableMatch = thresholds.match(/acceptable[:\s]*(\d+\.?\d*)[-\s]*(\d+\.?\d*)/i);
        const cibleMatch = thresholds.match(/cible[:\s]*[≥>=]+[?\s]*(\d+\.?\d*)/i);

        if (critiqueMatch) {
          const critiqueValue = parseFloat(critiqueMatch[1]);
          if (numValue < critiqueValue) return 'critique';
        }

        if (acceptableMatch) {
          const minAcceptable = parseFloat(acceptableMatch[1]);
          const maxAcceptable = parseFloat(acceptableMatch[2]);
          if (numValue >= minAcceptable && numValue < maxAcceptable) return 'alerte';
        }

        if (cibleMatch) {
          const cibleValue = parseFloat(cibleMatch[1]);
          if (numValue >= cibleValue) return 'conforme';
        }
      } else if (thresholds.includes('inférieur') || thresholds.includes('≤') || thresholds.includes('<=') || thresholds.includes('<')) {
        const critiqueMatch = thresholds.match(/critique[:\s]*>?[>\s]*(\d+\.?\d*)/i);
        const acceptableMatch = thresholds.match(/acceptable[:\s]*(\d+\.?\d*)[-\s]*(\d+\.?\d*)/i);
        const cibleMatch = thresholds.match(/cible[:\s]*[≤<=]+[?\s]*(\d+\.?\d*)/i);

        if (critiqueMatch) {
          const critiqueValue = parseFloat(critiqueMatch[1]);
          if (numValue > critiqueValue) return 'critique';
        }

        if (acceptableMatch) {
          const minAcceptable = parseFloat(acceptableMatch[1]);
          const maxAcceptable = parseFloat(acceptableMatch[2]);
          if (numValue >= minAcceptable && numValue <= maxAcceptable) return 'alerte';
        }

        if (cibleMatch) {
          const cibleValue = parseFloat(cibleMatch[1]);
          if (numValue <= cibleValue) return 'conforme';
        }
      }
    }

    if (thresholds.includes('100%') && thresholds.includes('critique')) {
      if (numValue === 100) return 'conforme';
      return 'critique';
    }

    if (thresholds.includes('0') && (thresholds.includes('cible') || thresholds.includes('objectif'))) {
      if (numValue === 0) return 'conforme';
      return 'critique';
    }

    return 'conforme';
  };

  const handleInputChange = (field: keyof Measurement, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'measured_value' || field === 'indicator_id') {
        const currentIndicator = indicators.find(ind => ind.id === (field === 'indicator_id' ? value : updated.indicator_id));
        if (currentIndicator && updated.measured_value) {
          updated.status = calculateStatus(updated.measured_value, currentIndicator);
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentIndicator = indicators.find(ind => ind.id === formData.indicator_id);
      const finalData = {
        ...formData,
        status: calculateStatus(formData.measured_value, currentIndicator)
      };

      if (selectedMeasurement?.id) {
        const { error } = await supabase
          .from('indicator_measurements')
          .update(finalData)
          .eq('id', selectedMeasurement.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('indicator_measurements')
          .insert([finalData]);

        if (error) throw error;
      }

      await loadMeasurements();
      resetForm();
      alert('Mesure enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setFormData({
      indicator_id: measurement.indicator_id,
      measurement_date: measurement.measurement_date,
      measured_value: measurement.measured_value,
      target_value: measurement.target_value,
      status: measurement.status,
      comments: measurement.comments,
      measured_by: measurement.measured_by,
      actions_taken: measurement.actions_taken
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette mesure ?')) return;

    try {
      const { error } = await supabase
        .from('indicator_measurements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadMeasurements();
      alert('Mesure supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      indicator_id: '',
      measurement_date: '',
      measured_value: '',
      target_value: '',
      status: 'conforme',
      comments: '',
      measured_by: '',
      actions_taken: ''
    });
    setSelectedMeasurement(null);
    setShowForm(false);
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    pdf.setFillColor(240, 248, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    pdf.setFillColor(70, 130, 180);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 3, 3, 'F');

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('REGISTRE DE SUIVI DES INDICATEURS', pageWidth / 2, yPos + 12, { align: 'center' });
    yPos += 25;

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 10;

    const filteredMeasurements = measurements.filter(m => {
      const matchIndicator = filterIndicator === 'all' || m.indicator_id === filterIndicator;
      const matchStatus = filterStatus === 'all' || m.status === filterStatus;
      return matchIndicator && matchStatus;
    });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Nombre total de mesures : ${filteredMeasurements.length}`, margin, yPos);
    yPos += 10;

    filteredMeasurements.forEach((measurement, index) => {
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        pdf.setFillColor(240, 248, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = margin;
      }

      const boxHeight = 50;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(70, 130, 180);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 2, 2, 'FD');

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${index + 1}. ${measurement.indicator?.name || 'N/A'}`, margin + 3, yPos + 6);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date : ${new Date(measurement.measurement_date).toLocaleDateString('fr-FR')}`, margin + 3, yPos + 12);
      pdf.text(`Valeur mesurée : ${measurement.measured_value} ${measurement.indicator?.unit || ''}`, margin + 3, yPos + 18);
      pdf.text(`Valeur cible : ${measurement.target_value}`, margin + 3, yPos + 24);

      const statusText = measurement.status === 'conforme' ? 'Conforme ✓' : measurement.status === 'alerte' ? 'Alerte ⚠' : 'Critique ✗';
      const statusColor = measurement.status === 'conforme' ? [0, 128, 0] : measurement.status === 'alerte' ? [255, 165, 0] : [255, 0, 0];
      pdf.setTextColor(...statusColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Statut : ${statusText}`, margin + 3, yPos + 30);

      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Mesuré par : ${measurement.measured_by}`, margin + 3, yPos + 36);

      if (measurement.comments) {
        const commentLines = pdf.splitTextToSize(`Commentaires : ${measurement.comments}`, pageWidth - 2 * margin - 6);
        pdf.text(commentLines[0], margin + 3, yPos + 42);
      }

      yPos += boxHeight + 3;
    });

    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Généré par PHARMA QMS - Module Traçabilité', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save(`registre-suivi-indicateurs-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conforme':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'alerte':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'critique':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      conforme: 'bg-green-100 text-green-800 border-green-300',
      alerte: 'bg-orange-100 text-orange-800 border-orange-300',
      critique: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const filteredMeasurements = measurements.filter(m => {
    const matchIndicator = filterIndicator === 'all' || m.indicator_id === filterIndicator;
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchIndicator && matchStatus;
  });

  const stats = {
    total: measurements.length,
    conforme: measurements.filter(m => m.status === 'conforme').length,
    alerte: measurements.filter(m => m.status === 'alerte').length,
    critique: measurements.filter(m => m.status === 'critique').length
  };

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
              {selectedMeasurement ? 'Modifier la mesure' : 'Nouvelle mesure d\'indicateur'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indicateur <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.indicator_id}
                  onChange={(e) => handleInputChange('indicator_id', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un indicateur...</option>
                  {indicators.map(indicator => (
                    <option key={indicator.id} value={indicator.id}>
                      {indicator.name} ({indicator.theme})
                    </option>
                  ))}
                </select>
                {formData.indicator_id && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Seuils d'alerte pour cet indicateur :</p>
                    <p className="text-xs text-blue-800">
                      {indicators.find(ind => ind.id === formData.indicator_id)?.alert_thresholds || 'Non défini'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de mesure <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.measurement_date}
                  onChange={(e) => handleInputChange('measurement_date', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeur mesurée <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.measured_value}
                    onChange={(e) => handleInputChange('measured_value', e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 85, 12.5, 45%..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeur cible
                  </label>
                  <input
                    type="text"
                    value={formData.target_value}
                    onChange={(e) => handleInputChange('target_value', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: ≥ 80%, < 5..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut (calculé automatiquement)
                </label>
                <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.status === 'conforme' && (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Conforme</p>
                        <p className="text-sm text-gray-600">Dans les seuils acceptables</p>
                      </div>
                    </>
                  )}
                  {formData.status === 'alerte' && (
                    <>
                      <AlertTriangle className="h-6 w-6 text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-800">Alerte</p>
                        <p className="text-sm text-gray-600">Nécessite une vigilance</p>
                      </div>
                    </>
                  )}
                  {formData.status === 'critique' && (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800">Critique</p>
                        <p className="text-sm text-gray-600">Nécessite des actions immédiates</p>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Le statut est déterminé automatiquement en fonction de la valeur mesurée et des seuils d'alerte définis pour l'indicateur.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesuré par <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.measured_by}
                  onChange={(e) => handleInputChange('measured_by', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de la personne"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires et observations
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Observations, contexte, explications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions mises en place
                </label>
                <textarea
                  value={formData.actions_taken}
                  onChange={(e) => handleInputChange('actions_taken', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Actions correctives ou préventives mises en œuvre..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
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
      <div className="max-w-7xl mx-auto">
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
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Registre de Suivi des Indicateurs</h1>
                <p className="text-gray-600">Enregistrement des mesures et suivi de la performance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generatePDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Exporter PDF</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Nouvelle mesure</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total mesures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conformes</p>
                <p className="text-2xl font-bold text-green-600">{stats.conforme}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.alerte}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{stats.critique}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Indicateur</label>
              <select
                value={filterIndicator}
                onChange={(e) => setFilterIndicator(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les indicateurs</option>
                {indicators.map(indicator => (
                  <option key={indicator.id} value={indicator.id}>{indicator.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="conforme">Conforme</option>
                <option value="alerte">Alerte</option>
                <option value="critique">Critique</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        ) : filteredMeasurements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune mesure enregistrée</h3>
            <p className="text-gray-600 mb-6">
              {indicators.length === 0
                ? "Commencez par créer des indicateurs dans le module 'Revue des Indicateurs'"
                : "Commencez à enregistrer les mesures de vos indicateurs"}
            </p>
            {indicators.length > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                <span>Enregistrer une mesure</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeasurements.map((measurement) => (
              <div key={measurement.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(measurement.status)}
                      <h3 className="text-lg font-bold text-gray-900">{measurement.indicator?.name || 'N/A'}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{measurement.indicator?.theme || ''}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(measurement.measurement_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(measurement.status)}`}>
                      {measurement.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Valeur mesurée</p>
                    <p className="text-sm font-semibold text-gray-900">{measurement.measured_value} {measurement.indicator?.unit || ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Valeur cible</p>
                    <p className="text-sm font-semibold text-gray-900">{measurement.target_value || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Mesuré par</p>
                    <p className="text-sm font-semibold text-gray-900">{measurement.measured_by}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Fréquence</p>
                    <p className="text-sm font-semibold text-gray-900">{measurement.indicator?.frequency || 'N/A'}</p>
                  </div>
                </div>

                {measurement.comments && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Commentaires</p>
                    <p className="text-sm text-gray-900">{measurement.comments}</p>
                  </div>
                )}

                {measurement.actions_taken && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Actions mises en place</p>
                    <p className="text-sm text-gray-900">{measurement.actions_taken}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(measurement)}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDelete(measurement.id!)}
                    className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
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

export default IndicatorTrackingModule;
