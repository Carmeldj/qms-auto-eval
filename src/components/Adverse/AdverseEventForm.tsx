import React, { useState } from 'react';
import { X, Download, AlertCircle, CheckCircle, Mail, Loader2 } from 'lucide-react';
import {
  NotifierInfo,
  PatientInfo,
  MedicalHistory,
  AdverseEvent,
  SuspectProduct,
  ProductContext,
  SeverityEvolution,
  AdverseEventReport
} from '../../types/adverseEvents';
import { adverseEventService } from '../../services/AdverseEventService';

interface AdverseEventFormProps {
  onCancel: () => void;
}

const AdverseEventForm: React.FC<AdverseEventFormProps> = ({ onCancel }) => {
  const [currentSection, setCurrentSection] = useState<'notifier' | 'patient' | 'history' | 'event' | 'products' | 'severity'>('notifier');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedReport, setSavedReport] = useState<AdverseEventReport | null>(null);

  const [notifier, setNotifier] = useState<NotifierInfo>({
    department: '',
    zs: '',
    commune: '',
    fs: '',
    fullName: '',
    qualification: 'pharmacien',
    telephone: '',
    email: '',
    notificationDate: new Date().toISOString().split('T')[0]
  });

  const [patient, setPatient] = useState<PatientInfo>({
    lastName: '',
    firstName: '',
    sex: 'M',
    address: '',
    isNewborn: false
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    pregnancy: false,
    alcoholism: false,
    hepatopathy: false,
    allergy: false,
    nephropathy: false,
    smoking: false,
    traditionalRemedy: false,
    chronicTreatment: false,
    previousReactionSameProduct: false,
    previousReactionOtherProduct: false
  });

  const [adverseEvent, setAdverseEvent] = useState<AdverseEvent>({
    fever: false,
    urticaria: false,
    localReactionSevere3Days: false,
    localReactionSevereLess3Days: false,
    localReactionBeyondJoint: false,
    febrileConvulsion: false,
    nonFebrileConvulsion: false,
    abscess: false,
    sepsis: false,
    encephalopathy: false,
    toxicShockSyndrome: false,
    thrombocytopenia: false,
    anaphylacticShock: false,
    lyellSyndrome: false,
    administrationDate: '',
    eventDate: ''
  });

  const [suspectProducts, setSuspectProducts] = useState<SuspectProduct[]>([{
    id: '1',
    productName: '',
    manufacturer: '',
    purchaseLocation: '',
    lotNumber: '',
    expirationDate: '',
    administrationRoute: '',
    dosage: '',
    indication: '',
    treatmentDuration: '',
    totalQuantity: '',
    startDate: '',
    endDate: ''
  }]);

  const [productContext, setProductContext] = useState<ProductContext>({
    selfMedication: false,
    pharmacodependence: false,
    therapeuticError: false,
    medicalPrescription: false,
    acquisitionPlace: 'pharmacie'
  });

  const [severity, setSeverity] = useState<SeverityEvolution>({
    hospitalization: false,
    prolongedHospitalization: false,
    permanentDisability: false,
    lifeThreatening: false,
    congenitalMalformation: false,
    death: false,
    recoveryWithoutSequelae: false,
    recoveryWithSequelae: false,
    notYetRecovered: false,
    complications: false,
    deceased: false,
    unknown: false,
    medicationStopped: false,
    effectDisappeared: false,
    effectDiminished: false,
    effectPersisted: false,
    dosageReduced: false,
    dosageEffectDisappeared: false,
    dosageEffectDiminished: false,
    dosageEffectPersisted: false,
    medicationReadministered: false,
    effectReappeared: false
  });

  const addProduct = () => {
    setSuspectProducts([...suspectProducts, {
      id: Date.now().toString(),
      productName: '',
      manufacturer: '',
      purchaseLocation: '',
      lotNumber: '',
      expirationDate: '',
      administrationRoute: '',
      dosage: '',
      indication: '',
      treatmentDuration: '',
      totalQuantity: '',
      startDate: '',
      endDate: ''
    }]);
  };

  const updateProduct = (id: string, field: keyof SuspectProduct, value: string) => {
    setSuspectProducts(suspectProducts.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removeProduct = (id: string) => {
    if (suspectProducts.length > 1) {
      setSuspectProducts(suspectProducts.filter(p => p.id !== id));
    }
  };

  const isFormValid = () => {
    return notifier.fullName.trim() !== '' &&
           notifier.commune.trim() !== '' &&
           notifier.telephone.trim() !== '' &&
           patient.lastName.trim() !== '' &&
           patient.firstName.trim() !== '' &&
           suspectProducts.some(p => p.productName.trim() !== '');
  };

  const createReport = (): AdverseEventReport => {
    return {
      id: Date.now().toString(),
      epidNumber: generateEpidNumber(),
      notifier,
      patient,
      medicalHistory,
      adverseEvent,
      suspectProducts: suspectProducts.filter(p => p.productName.trim() !== ''),
      productContext,
      severityEvolution: severity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleGeneratePDF = async () => {
    if (!isFormValid()) return;
    setIsGenerating(true);

    try {
      const report = createReport();
      await adverseEventService.saveReport(report);
      await adverseEventService.generatePDF(report);
      setSavedReport(report);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!savedReport) {
      const report = createReport();
      setSavedReport(report);
      try {
        await adverseEventService.saveReport(report);
      } catch (error) {
        console.error('Error saving report:', error);
        alert('Erreur lors de la sauvegarde du rapport');
        return;
      }
    }

    setIsSending(true);

    try {
      const reportToSend = savedReport || createReport();
      const pdfBase64 = adverseEventService.generatePDFBase64(reportToSend);
      await adverseEventService.sendEmail(reportToSend, pdfBase64);
      setShowSuccessModal(true);
      alert('Email envoyé avec succès à l\'ABMed!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setIsSending(false);
    }
  };

  const generateEpidNumber = () => {
    const ddd = notifier.department.substring(0, 3).toUpperCase();
    const ccc = notifier.commune.substring(0, 3).toUpperCase();
    const aa = new Date().getFullYear().toString().slice(-2);
    const nnnn = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BEN/${ddd}/${ccc}/${aa}/${nnnn}`;
  };

  const sections = [
    { id: 'notifier', label: 'Notificateur' },
    { id: 'patient', label: 'Patient' },
    { id: 'history', label: 'Antécédents' },
    { id: 'event', label: 'Événement' },
    { id: 'products', label: 'Produits' },
    { id: 'severity', label: 'Gravité' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Notification d'Effet Indésirable - ABMed
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Fiche de notification des effets/événements indésirables observés après l'utilisation de produit de santé
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={!isFormValid() || isGenerating}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg active:scale-95 transition-all duration-200 ${
                isFormValid() && !isGenerating
                  ? 'text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={isFormValid() && !isGenerating ? {backgroundColor: '#009688'} : {}}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>{isGenerating ? 'Génération...' : 'Générer PDF'}</span>
            </button>
            <button
              onClick={handleSendEmail}
              disabled={!isFormValid() || isSending}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg active:scale-95 transition-all duration-200 ${
                isFormValid() && !isSending
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              <span>{isSending ? 'Envoi...' : 'Envoyer à ABMed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                currentSection === section.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={currentSection === section.id ? {backgroundColor: '#009688'} : {}}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        {/* Notifier Section */}
        {currentSection === 'notifier' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Informations du Notificateur</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <input
                  type="text"
                  value={notifier.department}
                  onChange={(e) => setNotifier({...notifier, department: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Zone Sanitaire (ZS)
                </label>
                <input
                  type="text"
                  value={notifier.zs}
                  onChange={(e) => setNotifier({...notifier, zs: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Commune *
                </label>
                <input
                  type="text"
                  value={notifier.commune}
                  onChange={(e) => setNotifier({...notifier, commune: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Formation Sanitaire (FS)
                </label>
                <input
                  type="text"
                  value={notifier.fs}
                  onChange={(e) => setNotifier({...notifier, fs: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Nom et Prénom *
              </label>
              <input
                type="text"
                value={notifier.fullName}
                onChange={(e) => setNotifier({...notifier, fullName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Qualification *
                </label>
                <select
                  value={notifier.qualification}
                  onChange={(e) => setNotifier({...notifier, qualification: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="medecin">Médecin</option>
                  <option value="pharmacien">Pharmacien</option>
                  <option value="dentiste">Dentiste</option>
                  <option value="sage-femme">Sage-femme</option>
                  <option value="infirmier">Infirmier</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Spécialité
                </label>
                <input
                  type="text"
                  value={notifier.specialty || ''}
                  onChange={(e) => setNotifier({...notifier, specialty: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={notifier.telephone}
                  onChange={(e) => setNotifier({...notifier, telephone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={notifier.email}
                  onChange={(e) => setNotifier({...notifier, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Date de notification
              </label>
              <input
                type="date"
                value={notifier.notificationDate}
                onChange={(e) => setNotifier({...notifier, notificationDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>
          </div>
        )}

        {/* Patient Section - À continuer */}
        {currentSection === 'patient' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Informations du Patient</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={patient.lastName}
                  onChange={(e) => setPatient({...patient, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={patient.firstName}
                  onChange={(e) => setPatient({...patient, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Sexe
                </label>
                <select
                  value={patient.sex}
                  onChange={(e) => setPatient({...patient, sex: e.target.value as 'M' | 'F'})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Âge (années)
                </label>
                <input
                  type="number"
                  value={patient.ageYears || ''}
                  onChange={(e) => setPatient({...patient, ageYears: parseInt(e.target.value) || undefined})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Poids (Kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={patient.weight || ''}
                  onChange={(e) => setPatient({...patient, weight: parseFloat(e.target.value) || undefined})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Taille (Cm)
                </label>
                <input
                  type="number"
                  value={patient.height || ''}
                  onChange={(e) => setPatient({...patient, height: parseInt(e.target.value) || undefined})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <textarea
                value={patient.address}
                onChange={(e) => setPatient({...patient, address: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Les autres sections seront ajoutées de manière similaire */}
        {currentSection === 'history' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Antécédents / Facteurs Favorisants</h3>
            <p className="text-sm text-gray-600 mb-4">Cochez tous les antécédents pertinents du patient</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries({
                pregnancy: 'Grossesse',
                alcoholism: 'Alcoolisme',
                hepatopathy: 'Hépatopathie',
                allergy: 'Allergie',
                nephropathy: 'Néphropathie',
                smoking: 'Tabagisme',
                traditionalRemedy: 'Remède traditionnel',
                chronicTreatment: 'Traitement chronique',
                previousReactionSameProduct: 'Réaction antérieure au même produit',
                previousReactionOtherProduct: 'Réaction antérieure à un autre produit'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medicalHistory[key as keyof MedicalHistory] as boolean}
                    onChange={(e) => setMedicalHistory({...medicalHistory, [key]: e.target.checked})}
                    className="w-4 h-4 rounded"
                    style={{accentColor: '#009688'}}
                  />
                  <span className="text-sm sm:text-base text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Autres (préciser)
              </label>
              <textarea
                value={medicalHistory.other || ''}
                onChange={(e) => setMedicalHistory({...medicalHistory, other: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Event Section */}
        {currentSection === 'event' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Événement(s) Indésirable(s)</h3>
            <p className="text-sm text-gray-600 mb-4">Cochez tous les événements indésirables observés</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'fever', label: 'Fièvre (>38°C)' },
                { key: 'urticaria', label: 'Urticaire' },
                { key: 'localReactionSevere3Days', label: 'Réaction locale sévère (>3jrs)' },
                { key: 'localReactionSevereLess3Days', label: 'Réaction locale sévère (<3jrs)' },
                { key: 'localReactionBeyondJoint', label: 'Réaction locale s\'étendant au-delà de l\'articulation' },
                { key: 'febrileConvulsion', label: 'Convulsion fébrile' },
                { key: 'nonFebrileConvulsion', label: 'Convulsion non fébrile' },
                { key: 'abscess', label: 'Abcès' },
                { key: 'sepsis', label: 'Septicémie' },
                { key: 'encephalopathy', label: 'Encéphalopathie' },
                { key: 'toxicShockSyndrome', label: 'Syndrome de choc toxique' },
                { key: 'thrombocytopenia', label: 'Thrombopénie' },
                { key: 'anaphylacticShock', label: 'Choc anaphylactique' },
                { key: 'lyellSyndrome', label: 'Syndrome de Lyell' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adverseEvent[key as keyof AdverseEvent] as boolean}
                    onChange={(e) => setAdverseEvent({...adverseEvent, [key]: e.target.checked})}
                    className="w-4 h-4 rounded"
                    style={{accentColor: '#009688'}}
                  />
                  <span className="text-sm sm:text-base text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Si autres, décrire
              </label>
              <textarea
                value={adverseEvent.otherDescription || ''}
                onChange={(e) => setAdverseEvent({...adverseEvent, otherDescription: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
                placeholder="Décrire les autres événements indésirables observés..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Date de prise/vaccination
                </label>
                <input
                  type="date"
                  value={adverseEvent.administrationDate}
                  onChange={(e) => setAdverseEvent({...adverseEvent, administrationDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Date d'apparition de l'événement
                </label>
                <input
                  type="date"
                  value={adverseEvent.eventDate}
                  onChange={(e) => setAdverseEvent({...adverseEvent, eventDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-4">
                Délai d'apparition après la prise/vaccination
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={adverseEvent.delayMinutes || ''}
                    onChange={(e) => setAdverseEvent({...adverseEvent, delayMinutes: parseInt(e.target.value) || undefined})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Heures</label>
                  <input
                    type="number"
                    value={adverseEvent.delayHours || ''}
                    onChange={(e) => setAdverseEvent({...adverseEvent, delayHours: parseInt(e.target.value) || undefined})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Jours</label>
                  <input
                    type="number"
                    value={adverseEvent.delayDays || ''}
                    onChange={(e) => setAdverseEvent({...adverseEvent, delayDays: parseInt(e.target.value) || undefined})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mois</label>
                  <input
                    type="number"
                    value={adverseEvent.delayMonths || ''}
                    onChange={(e) => setAdverseEvent({...adverseEvent, delayMonths: parseInt(e.target.value) || undefined})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {currentSection === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Produits Suspects</h3>
                <p className="text-sm text-gray-600">Médicaments, vaccins, solvants et plantes médicinales</p>
              </div>
              <button
                onClick={addProduct}
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base"
                style={{backgroundColor: '#009688'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
              >
                <span>+ Ajouter</span>
              </button>
            </div>

            {suspectProducts.map((product, index) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Produit {index + 1}</h4>
                  {suspectProducts.length > 1 && (
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Nom du produit *
                      </label>
                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) => updateProduct(product.id, 'productName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Nom du fabricant
                      </label>
                      <input
                        type="text"
                        value={product.manufacturer}
                        onChange={(e) => updateProduct(product.id, 'manufacturer', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Lieu d'achat
                      </label>
                      <input
                        type="text"
                        value={product.purchaseLocation}
                        onChange={(e) => updateProduct(product.id, 'purchaseLocation', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        N° de lot
                      </label>
                      <input
                        type="text"
                        value={product.lotNumber}
                        onChange={(e) => updateProduct(product.id, 'lotNumber', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Date de péremption
                      </label>
                      <input
                        type="date"
                        value={product.expirationDate}
                        onChange={(e) => updateProduct(product.id, 'expirationDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Voie d'administration
                      </label>
                      <select
                        value={product.administrationRoute}
                        onChange={(e) => updateProduct(product.id, 'administrationRoute', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Orale">Orale</option>
                        <option value="Injectable (IM)">Injectable (IM)</option>
                        <option value="Injectable (IV)">Injectable (IV)</option>
                        <option value="Injectable (SC)">Injectable (SC)</option>
                        <option value="Cutanée">Cutanée</option>
                        <option value="Rectale">Rectale</option>
                        <option value="Oculaire">Oculaire</option>
                        <option value="Nasale">Nasale</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Posologie
                      </label>
                      <input
                        type="text"
                        value={product.dosage}
                        onChange={(e) => updateProduct(product.id, 'dosage', e.target.value)}
                        placeholder="ex: 500mg 3x/jour"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Indication / Motif de traitement
                    </label>
                    <input
                      type="text"
                      value={product.indication}
                      onChange={(e) => updateProduct(product.id, 'indication', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={product.startDate}
                        onChange={(e) => updateProduct(product.id, 'startDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={product.endDate}
                        onChange={(e) => updateProduct(product.id, 'endDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Durée du traitement
                      </label>
                      <input
                        type="text"
                        value={product.treatmentDuration}
                        onChange={(e) => updateProduct(product.id, 'treatmentDuration', e.target.value)}
                        placeholder="ex: 7 jours"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-3">Contexte d'utilisation</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'selfMedication', label: 'Automédication' },
                  { key: 'pharmacodependence', label: 'Pharmacodépendance' },
                  { key: 'therapeuticError', label: 'Erreur thérapeutique' },
                  { key: 'medicalPrescription', label: 'Prescription médicale' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productContext[key as keyof ProductContext] as boolean}
                      onChange={(e) => setProductContext({...productContext, [key]: e.target.checked})}
                      className="w-4 h-4 rounded"
                      style={{accentColor: '#009688'}}
                    />
                    <span className="text-xs sm:text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Lieu d'acquisition
                </label>
                <select
                  value={productContext.acquisitionPlace}
                  onChange={(e) => setProductContext({...productContext, acquisitionPlace: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="pharmacie">Pharmacie</option>
                  <option value="formation_sanitaire">Formation Sanitaire</option>
                  <option value="rue">Rue</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Severity Section */}
        {currentSection === 'severity' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Gravité et Évolution</h3>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Gravité de l'événement</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'hospitalization', label: 'Hospitalisation' },
                  { key: 'prolongedHospitalization', label: 'Prolongation d\'hospitalisation' },
                  { key: 'permanentDisability', label: 'Incapacité ou invalidité permanente' },
                  { key: 'lifeThreatening', label: 'Mise en jeu du pronostic vital' },
                  { key: 'congenitalMalformation', label: 'Malformation congénitale' },
                  { key: 'death', label: 'Décès' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={severity[key as keyof SeverityEvolution] as boolean}
                      onChange={(e) => setSeverity({...severity, [key]: e.target.checked})}
                      className="w-4 h-4 rounded"
                      style={{accentColor: '#009688'}}
                    />
                    <span className="text-sm sm:text-base text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Évolution</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'recoveryWithoutSequelae', label: 'Guérison sans séquelle' },
                  { key: 'recoveryWithSequelae', label: 'Guérison avec séquelle' },
                  { key: 'notYetRecovered', label: 'Pas encore guéri' },
                  { key: 'complications', label: 'Complications' },
                  { key: 'deceased', label: 'Décès' },
                  { key: 'unknown', label: 'Inconnu' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={severity[key as keyof SeverityEvolution] as boolean}
                      onChange={(e) => setSeverity({...severity, [key]: e.target.checked})}
                      className="w-4 h-4 rounded"
                      style={{accentColor: '#009688'}}
                    />
                    <span className="text-sm sm:text-base text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-900 mb-3">Attitude adoptée</h4>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={severity.medicationStopped}
                      onChange={(e) => setSeverity({...severity, medicationStopped: e.target.checked})}
                      className="w-4 h-4 rounded"
                      style={{accentColor: '#009688'}}
                    />
                    <span className="text-sm font-medium text-gray-900">Arrêt du médicament</span>
                  </label>
                  {severity.medicationStopped && (
                    <div className="ml-6 space-y-2">
                      <p className="text-xs text-gray-600 mb-2">Si Oui, l'effet indésirable a:</p>
                      {[
                        { key: 'effectDisappeared', label: 'Disparu' },
                        { key: 'effectDiminished', label: 'Diminué' },
                        { key: 'effectPersisted', label: 'Persisté' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={severity[key as keyof SeverityEvolution] as boolean}
                            onChange={(e) => setSeverity({...severity, [key]: e.target.checked})}
                            className="w-4 h-4 rounded"
                            style={{accentColor: '#009688'}}
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={severity.dosageReduced}
                      onChange={(e) => setSeverity({...severity, dosageReduced: e.target.checked})}
                      className="w-4 h-4 rounded"
                      style={{accentColor: '#009688'}}
                    />
                    <span className="text-sm font-medium text-gray-900">Diminution de la dose du médicament</span>
                  </label>
                  {severity.dosageReduced && (
                    <div className="ml-6 space-y-2">
                      <p className="text-xs text-gray-600 mb-2">Si Oui, l'effet indésirable a:</p>
                      {[
                        { key: 'dosageEffectDisappeared', label: 'Disparu' },
                        { key: 'dosageEffectDiminished', label: 'Diminué' },
                        { key: 'dosageEffectPersisted', label: 'Persisté' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={severity[key as keyof SeverityEvolution] as boolean}
                            onChange={(e) => setSeverity({...severity, [key]: e.target.checked})}
                            className="w-4 h-4 rounded"
                            style={{accentColor: '#009688'}}
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={severity.medicationReadministered}
                      onChange={(e) => setSeverity({...severity, medicationReadministered: e.target.checked})}
                      className="w-4 h-4 rounded"
                      style={{accentColor: '#009688'}}
                    />
                    <span className="text-sm font-medium text-gray-900">Le médicament a été réadministré</span>
                  </label>
                  {severity.medicationReadministered && (
                    <div className="ml-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={severity.effectReappeared}
                          onChange={(e) => setSeverity({...severity, effectReappeared: e.target.checked})}
                          className="w-4 h-4 rounded"
                          style={{accentColor: '#009688'}}
                        />
                        <span className="text-sm text-gray-700">L'effet indésirable est réapparu</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mt-6">
        <div className="flex items-center space-x-2">
          {isFormValid() ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium text-sm sm:text-base">Notification prête à être générée en PDF ou envoyée par email</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium text-sm sm:text-base">
                Veuillez compléter les champs obligatoires du notificateur et du patient
              </span>
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Notification enregistrée</h3>
              <p className="text-sm text-gray-600 mb-6">
                Votre notification a été sauvegardée avec succès. Le numéro épidémiologique est:
              </p>
              <div className="bg-gray-100 rounded-lg p-3 mb-6">
                <p className="font-mono font-bold text-lg" style={{color: '#009688'}}>
                  {savedReport?.epidNumber}
                </p>
              </div>
              <div className="space-y-3">
                {!isSending && (
                  <button
                    onClick={handleSendEmail}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Envoyer par email à ABMed</span>
                  </button>
                )}
                {isSending && (
                  <button
                    disabled
                    className="w-full flex items-center justify-center space-x-2 bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </button>
                )}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdverseEventForm;
