import React, { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Send, Download, List, Settings, Upload, Lock, Eye, EyeOff, X } from 'lucide-react';
import { OrdonnancierEntry, PRODUITS_SOUS_CONTROLE, TRIMESTRES } from '../types/ordonnancier';
import { ordonnancierService } from '../services/OrdonnancierService';
import { PrescriptionFileService } from '../services/PrescriptionFileService';
import ClassificationBadge from './ClassificationBadge';
import PrescriptionViewer from './PrescriptionViewer';
import { signatureGenerator } from '../services/SignatureGenerator';
import { stampGenerator } from '../services/StampGenerator';
import { useAuth } from '../contexts/AuthContext';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const OrdonnancierModule: React.FC = () => {
  const [view, setView] = useState<'list' | 'add' | 'trimester' | 'settings'>('list');
  const [entries, setEntries] = useState<OrdonnancierEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<OrdonnancierEntry[]>([]);
  const [selectedTrimester, setSelectedTrimester] = useState<number>(getCurrentTrimester());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [pharmacyName, setPharmacyName] = useState<string>('');
  const [pharmacyInitials, setPharmacyInitials] = useState<string>('');
  const [pharmacyEmail, setPharmacyEmail] = useState<string>('');
  const user = useAuth().user;

  const handlePharmacyNameChange = (value: string) => {
    setPharmacyName(value);
    if (value.trim()) {
      const words = value.trim().split(/\s+/);
      const autoInitials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
      setPharmacyInitials(autoInitials);
    }
  };

  const handleInitialsChange = (value: string) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 3);
    setPharmacyInitials(sanitized);
  };

  const [formData, setFormData] = useState<Partial<OrdonnancierEntry>>({
    dateDelivrance: new Date().toISOString().split('T')[0],
    prescripteur: { nomPrenoms: '', numeroOrdre: '' },
    patient: { nomPrenoms: '', adresse: '' },
    produit: { nature: '', dose: '', quantite: 1 },
    prixVente: 0,
    pharmacien: { nom: '', signature: '' }
  });

  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPassword, setPrescriptionPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [viewingPrescription, setViewingPrescription] = useState<{ id: string; label: string } | null>(null);

  // État pour le modal de configuration du rapport trimestriel
  const [showReportConfig, setShowReportConfig] = useState(false);
  const [reportAction, setReportAction] = useState<'download' | 'send' | null>(null);
  const [reportConfig, setReportConfig] = useState({
    pharmacistName: '',
    signatureImage: undefined as string | undefined,
    stampImage: undefined as string | undefined
  });

  function getCurrentTrimester(): number {
    const month = new Date().getMonth() + 1;
    return Math.ceil(month / 3);
  }

  useEffect(() => {
    loadEntries();
    loadPharmacySettings();
  }, []);

  useEffect(() => {
    filterEntriesByTrimester();
  }, [entries, selectedTrimester, selectedYear]);

  const loadPharmacySettings = () => {
    const savedName = localStorage.getItem('pharmacyName');
    const savedInitials = localStorage.getItem('pharmacyInitials');
    const savedEmail = localStorage.getItem('pharmacyEmail');

    if (savedName) setPharmacyName(savedName);
    if (savedInitials) setPharmacyInitials(savedInitials);
    if (savedEmail) setPharmacyEmail(savedEmail);
  };

  const savePharmacySettings = () => {
    localStorage.setItem('pharmacyName', pharmacyName);
    localStorage.setItem('pharmacyInitials', pharmacyInitials);
    localStorage.setItem('pharmacyEmail', pharmacyEmail);
    alert('Paramètres sauvegardés avec succès!');
  };

  const loadEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/ordonnancier_entries?order=date_delivrance.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const mappedEntries: OrdonnancierEntry[] = data.map((item: any) => ({
          id: item.id,
          numeroOrdre: item.numero_ordre,
          dateDelivrance: item.date_delivrance,
          prescripteur: {
            nomPrenoms: item.prescripteur_nom_prenoms,
            numeroOrdre: item.prescripteur_numero_ordre
          },
          patient: {
            nomPrenoms: item.patient_nom_prenoms,
            adresse: item.patient_adresse
          },
          produit: {
            nature: item.produit_nature,
            dose: item.produit_dose,
            quantite: item.produit_quantite
          },
          prixVente: item.prix_vente,
          pharmacien: {
            nom: item.pharmacien_nom,
            signature: item.pharmacien_signature
          },
          prescriptionFileUrl: item.prescription_file_url,
          prescriptionFileType: item.prescription_file_type,
          prescriptionPasswordHash: item.prescription_password_hash,
          prescriptionUploadedAt: item.prescription_uploaded_at,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        setEntries(mappedEntries);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntriesByTrimester = () => {
    const filtered = entries.filter(entry => {
      const date = new Date(entry.dateDelivrance);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const trimestre = Math.ceil(month / 3);

      return trimestre === selectedTrimester && year === selectedYear;
    });
    const filtered2 = filtered.filter(f => {
      return f.createdBy === (user?.email || "");
    })
    setFilteredEntries(filtered2);
  };

  const handleDownloadPDF = () => {
    // Ouvrir le modal de configuration
    setReportAction('download');
    setShowReportConfig(true);
  };

  const executeDownloadPDF = async () => {
    try {
      await ordonnancierService.generateTrimesterPDF(
        filteredEntries,
        selectedTrimester,
        selectedYear,
        pharmacyName || '',
        pharmacyInitials || '',
        reportConfig.pharmacistName,
        reportConfig.signatureImage,
        reportConfig.stampImage
      );
      setShowReportConfig(false);
      setReportConfig({ pharmacistName: '', signatureImage: undefined, stampImage: undefined });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const handleSendEmail = () => {
    if (filteredEntries.length === 0) {
      alert('Aucune délivrance à envoyer pour ce trimestre');
      return;
    }

    if (!pharmacyName.trim() || !pharmacyEmail.trim()) {
      alert('Veuillez configurer le nom et l\'email de la pharmacie dans les paramètres');
      return;
    }

    // Ouvrir le modal de configuration
    setReportAction('send');
    setShowReportConfig(true);
  };

  const executeSendEmail = async () => {
    setLoading(true);
    try {
      // Générer et télécharger le PDF
      const pdfBlob = await ordonnancierService.generateTrimesterReportPDF(
        filteredEntries,
        selectedTrimester,
        selectedYear,
        pharmacyName,
        pharmacyInitials,
        reportConfig.pharmacistName,
        reportConfig.signatureImage,
        reportConfig.stampImage
      );

      // Télécharger le PDF
      const fileName = `rapport_ordonnancier_T${selectedTrimester}_${selectedYear}.pdf`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);

      // Préparer le message email
      const subject = `Rapport Trimestriel Ordonnancier - T${selectedTrimester} ${selectedYear}`;
      const body = [
        'Bonjour,',
        '',
        `Veuillez trouver ci-joint le rapport trimestriel de l'ordonnancier pour le trimestre ${selectedTrimester} de l'année ${selectedYear}.`,
        '',
        `Pharmacie: ${pharmacyName}`,
        `Nombre de délivrances: ${filteredEntries.length}`,
        `Période: ${TRIMESTRES[selectedTrimester - 1].label}`,
        '',
        'Le rapport PDF complet a été téléchargé. Veuillez l\'attacher à cet email avant l\'envoi.',
        '',
        'Cordialement,',
        reportConfig.pharmacistName
      ].join('\n');

      // Ouvrir Gmail
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');

      setShowReportConfig(false);
      setReportConfig({ pharmacistName: '', signatureImage: undefined, stampImage: undefined });
      alert('Le rapport PDF a été téléchargé et Gmail a été ouvert. N\'oubliez pas d\'attacher le PDF et de saisir l\'adresse email de l\'agence du médicament.');
    } catch (error) {
      console.error('Error preparing email:', error);
      alert('Erreur lors de la préparation de l\'email. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setReportConfig(prev => ({
        ...prev,
        signatureImage: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleReportStampUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setReportConfig(prev => ({
        ...prev,
        stampImage: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const generateDefaultSignature = () => {
    if (!reportConfig.pharmacistName.trim()) {
      alert('Veuillez entrer le nom du pharmacien');
      return;
    }
    try {
      const signature = signatureGenerator.generateSignature(reportConfig.pharmacistName);
      setReportConfig(prev => ({
        ...prev,
        signatureImage: signature
      }));
    } catch (error) {
      console.error('Error generating signature:', error);
      alert('Erreur lors de la génération de la signature');
    }
  };

  const generateDefaultStamp = () => {
    if (!reportConfig.pharmacistName.trim()) {
      alert('Veuillez entrer le nom du pharmacien');
      return;
    }
    try {
      const stamp = stampGenerator.generateCustomStamp({
        pharmacyName: pharmacyName || 'PHARMACIE',
        centerText: 'PHARMACIEN',
        topText: pharmacyName.toUpperCase(),
        bottomText: reportConfig.pharmacistName.toUpperCase()
      });
      setReportConfig(prev => ({
        ...prev,
        stampImage: stamp
      }));
    } catch (error) {
      console.error('Error generating stamp:', error);
      alert('Erreur lors de la génération du cachet');
    }
  };

  const generateInitialsSignature = (name: string): string => {
    if (!name.trim()) return '';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      const lastName = nameParts[nameParts.length - 1];
      const firstNameInitial = nameParts[0][0].toUpperCase();
      return `${lastName} ${firstNameInitial}`;
    }
    return name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const date = new Date(formData.dateDelivrance!);
      const month = date.getMonth() + 1;
      const trimestre = Math.ceil(month / 3);
      const annee = date.getFullYear();

      const nextNumeroResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/ordonnancier_entries?select=numero_ordre&order=numero_ordre.desc&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      let nextNumero = 1;
      if (nextNumeroResponse.ok) {
        const data = await nextNumeroResponse.json();
        if (data.length > 0) {
          nextNumero = data[0].numero_ordre + 1;
        }
      }

      const payload = {
        numero_ordre: nextNumero,
        date_delivrance: formData.dateDelivrance,
        prescripteur_nom_prenoms: formData.prescripteur!.nomPrenoms,
        prescripteur_numero_ordre: formData.prescripteur!.numeroOrdre,
        patient_nom_prenoms: formData.patient!.nomPrenoms,
        patient_adresse: formData.patient!.adresse,
        produit_nature: formData.produit!.nature,
        produit_dose: formData.produit!.dose,
        produit_quantite: formData.produit!.quantite,
        prix_vente: formData.prixVente,
        pharmacien_nom: formData.pharmacien!.nom,
        pharmacien_signature: formData.pharmacien!.signature,
        trimestre: trimestre,
        annee: annee,
        createdBy: user?.email || ""
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/ordonnancier_entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const createdEntry = await response.json();
        const entryId = createdEntry[0]?.id;

        // Upload du fichier d'ordonnance si présent
        if (prescriptionFile && prescriptionPassword && entryId) {
          setUploadingFile(true);
          try {
            await PrescriptionFileService.uploadPrescriptionFile({
              file: prescriptionFile,
              password: prescriptionPassword,
              entryId: entryId
            });
            alert('Entrée et ordonnance enregistrées avec succès!');
          } catch (uploadError) {
            console.error('Erreur upload ordonnance:', uploadError);
            alert('Entrée enregistrée, mais erreur lors de l\'upload de l\'ordonnance: ' +
              (uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'));
          } finally {
            setUploadingFile(false);
          }
        } else {
          alert('Entrée enregistrée avec succès!');
        }

        // Réinitialiser le formulaire
        setFormData({
          dateDelivrance: new Date().toISOString().split('T')[0],
          prescripteur: { nomPrenoms: '', numeroOrdre: '' },
          patient: { nomPrenoms: '', adresse: '' },
          produit: { nature: '', dose: '', quantite: 1 },
          prixVente: 0,
          pharmacien: { nom: '', signature: '' }
        });
        setIsCustomProduct(false);
        setPrescriptionFile(null);
        setPrescriptionPassword('');
        await loadEntries();
        setView('list');
      } else {
        throw new Error('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Registre Ordonnancier</h2>
        <button
          onClick={() => setView('add')}
          className="flex items-center space-x-2 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
          style={{ backgroundColor: '#009688' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle délivrance</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setView('trimester')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Rapport Trimestriel</span>
          </button>
          <button
            onClick={() => setView('settings')}
            className="flex items-center space-x-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Paramètres</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm sm:text-base">Chargement...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8">
            <List className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Aucune délivrance enregistrée</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">N°</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Prescripteur</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">N° Ordre Médecin</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Patient</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Produit</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Quantité</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Prix</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Pharmacien</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">N° Ordre Pharmacien</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Ordonnance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.slice(0, 20).map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{entry.numeroOrdre}</td>
                      <td className="px-4 py-3">{new Date(entry.dateDelivrance).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3">{entry.prescripteur.nomPrenoms}</td>
                      <td className="px-4 py-3">{entry.prescripteur.numeroOrdre || '-'}</td>
                      <td className="px-4 py-3">{entry.patient.nomPrenoms}</td>
                      <td className="px-4 py-3">{entry.produit.nature}</td>
                      <td className="px-4 py-3">{entry.produit.quantite}</td>
                      <td className="px-4 py-3">{entry.prixVente} FCFA</td>
                      <td className="px-4 py-3">{entry.pharmacien.nom}</td>
                      <td className="px-4 py-3">{entry.pharmacien.signature || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        {entry.prescriptionFileUrl ? (
                          <button
                            onClick={() => setViewingPrescription({
                              id: entry.id,
                              label: `N°${entry.numeroOrdre} - ${entry.patient.nomPrenoms}`
                            })}
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Voir</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-4">
              {entries.slice(0, 20).map(entry => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">N° {entry.numeroOrdre}</span>
                    <span className="text-xs text-gray-600">{new Date(entry.dateDelivrance).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium text-gray-700">Prescripteur:</span> {entry.prescripteur.nomPrenoms} {entry.prescripteur.numeroOrdre && `(N°${entry.prescripteur.numeroOrdre})`}</div>
                    <div><span className="font-medium text-gray-700">Patient:</span> {entry.patient.nomPrenoms}</div>
                    <div><span className="font-medium text-gray-700">Produit:</span> {entry.produit.nature}</div>
                    <div><span className="font-medium text-gray-700">Pharmacien:</span> {entry.pharmacien.nom} {entry.pharmacien.signature && `(N°${entry.pharmacien.signature})`}</div>
                    <div className="flex justify-between">
                      <span><span className="font-medium text-gray-700">Qté:</span> {entry.produit.quantite}</span>
                      <span className="font-semibold" style={{ color: '#009688' }}>{entry.prixVente} FCFA</span>
                    </div>
                  </div>
                  {entry.prescriptionFileUrl && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => setViewingPrescription({
                          id: entry.id,
                          label: `N°${entry.numeroOrdre} - ${entry.patient.nomPrenoms}`
                        })}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Voir l'ordonnance</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderAddForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nouvelle Délivrance</h2>
          <button
            onClick={() => setView('list')}
            className="text-gray-600 hover:text-gray-800 text-sm sm:text-base"
          >
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de délivrance *
            </label>
            <input
              type="date"
              required
              value={formData.dateDelivrance}
              onChange={(e) => setFormData({ ...formData, dateDelivrance: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescripteur</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom et prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prescripteur?.nomPrenoms}
                  onChange={(e) => setFormData({
                    ...formData,
                    prescripteur: { ...formData.prescripteur!, nomPrenoms: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° Ordre des médecins
                </label>
                <input
                  type="text"
                  value={formData.prescripteur?.numeroOrdre}
                  onChange={(e) => setFormData({
                    ...formData,
                    prescripteur: { ...formData.prescripteur!, numeroOrdre: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom et prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patient?.nomPrenoms}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient!, nomPrenoms: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.patient?.adresse}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient!, adresse: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature du produit *
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={!isCustomProduct}
                        onChange={() => {
                          setIsCustomProduct(false);
                          setFormData({
                            ...formData,
                            produit: { ...formData.produit!, nature: '' }
                          });
                        }}
                        className="w-4 h-4"
                        style={{ accentColor: '#009688' }}
                      />
                      <span className="text-sm text-gray-700">Sélectionner dans la liste</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={isCustomProduct}
                        onChange={() => {
                          setIsCustomProduct(true);
                          setFormData({
                            ...formData,
                            produit: { ...formData.produit!, nature: '' }
                          });
                        }}
                        className="w-4 h-4"
                        style={{ accentColor: '#009688' }}
                      />
                      <span className="text-sm text-gray-700">Saisir manuellement</span>
                    </label>
                  </div>

                  {!isCustomProduct ? (
                    <select
                      required
                      value={formData.produit?.nature}
                      onChange={(e) => setFormData({
                        ...formData,
                        produit: { ...formData.produit!, nature: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Sélectionner...</option>
                      {PRODUITS_SOUS_CONTROLE.map(produit => (
                        <option key={produit} value={produit}>{produit}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Entrer le nom du produit"
                      value={formData.produit?.nature}
                      onChange={(e) => setFormData({
                        ...formData,
                        produit: { ...formData.produit!, nature: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dose
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 10mg"
                    value={formData.produit?.dose}
                    onChange={(e) => setFormData({
                      ...formData,
                      produit: { ...formData.produit!, dose: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.produit?.quantite}
                    onChange={(e) => setFormData({
                      ...formData,
                      produit: { ...formData.produit!, quantite: parseInt(e.target.value) }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.prixVente}
                    onChange={(e) => setFormData({ ...formData, prixVente: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacien</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du pharmacien *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pharmacien?.nom}
                  onChange={(e) => setFormData({
                    ...formData,
                    pharmacien: { ...formData.pharmacien!, nom: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro d'ordre du pharmacien
                </label>
                <input
                  type="text"
                  value={formData.pharmacien?.signature}
                  onChange={(e) => setFormData({
                    ...formData,
                    pharmacien: { ...formData.pharmacien!, signature: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: 123/BEN"
                />
              </div>
            </div>
          </div>

          {/* Section Upload Ordonnance */}
          <div className="border-t pt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3 mb-4">
                <Upload className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    📄 Copie de l'ordonnance (Optionnel mais recommandé)
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Joignez une copie PDF ou photo (JPG/PNG) de l'ordonnance originale.
                    Le document sera protégé par mot de passe et accessible uniquement avec ce mot de passe.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Champ de fichier */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fichier d'ordonnance (PDF, JPG ou PNG - Max 10 MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPrescriptionFile(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-700
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        border-2 border-gray-300 rounded-lg
                        focus:outline-none focus:border-blue-500"
                    />
                    {prescriptionFile && (
                      <div className="mt-2 flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {prescriptionFile.name} ({(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => setPrescriptionFile(null)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Champ mot de passe */}
                {prescriptionFile && (
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                    <div className="flex items-start space-x-2 mb-3">
                      <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                          Mot de passe de protection <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-600 mb-3">
                          Ce mot de passe sera requis pour consulter le fichier d'ordonnance.
                          Minimum 4 caractères. <strong>Notez-le bien!</strong>
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={prescriptionPassword}
                        onChange={(e) => setPrescriptionPassword(e.target.value)}
                        placeholder="Entrez le mot de passe"
                        minLength={4}
                        required={!!prescriptionFile}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 pr-12
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {prescriptionPassword && prescriptionPassword.length < 4 && (
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Le mot de passe doit contenir au moins 4 caractères
                      </p>
                    )}

                    {prescriptionPassword && prescriptionPassword.length >= 4 && (
                      <p className="text-xs text-green-600 mt-2 flex items-center space-x-1">
                        <span>✓</span>
                        <span>Mot de passe valide</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {prescriptionFile && !prescriptionPassword && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 flex items-start space-x-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Attention :</strong> Vous devez définir un mot de passe pour protéger le fichier d'ordonnance.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || uploadingFile || (prescriptionFile != null && !prescriptionPassword) || (prescriptionFile != null && prescriptionPassword.length < 4)}
              className="flex-1 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
              style={{ backgroundColor: (loading || uploadingFile || (prescriptionFile != null && !prescriptionPassword) || (prescriptionFile != null && prescriptionPassword.length < 4)) ? '#ccc' : '#009688' }}
            >
              {loading || uploadingFile ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-4 sm:px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm sm:text-base"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderTrimesterView = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapport Trimestriel</h2>
          <button
            onClick={() => setView('list')}
            className="text-gray-600 hover:text-gray-800 text-sm sm:text-base"
          >
            Retour
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trimestre
            </label>
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {TRIMESTRES.map(t => (
                <option key={t.numero} value={t.numero}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6">
          <p className="text-xs sm:text-sm text-blue-900">
            <strong>Période:</strong> {TRIMESTRES.find(t => t.numero === selectedTrimester)?.label} {selectedYear}
          </p>
          <p className="text-xs sm:text-sm text-blue-900 mt-2">
            <strong>Total de délivrances:</strong> {filteredEntries.length}
          </p>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Aucune délivrance pour ce trimestre</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">N°</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Prescripteur</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">N° Ordre Médecin</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Patient</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Produit</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Quantité</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Prix</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Pharmacien</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">N° Ordre Pharmacien</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Ordonnance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{entry.numeroOrdre}</td>
                      <td className="px-4 py-3">{new Date(entry.dateDelivrance).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3">{entry.prescripteur.nomPrenoms}</td>
                      <td className="px-4 py-3">{entry.prescripteur.numeroOrdre || '-'}</td>
                      <td className="px-4 py-3">{entry.patient.nomPrenoms}</td>
                      <td className="px-4 py-3">{entry.produit.nature}</td>
                      <td className="px-4 py-3">{entry.produit.quantite}</td>
                      <td className="px-4 py-3">{entry.prixVente} FCFA</td>
                      <td className="px-4 py-3">{entry.pharmacien.nom}</td>
                      <td className="px-4 py-3">{entry.pharmacien.signature || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        {entry.prescriptionFileUrl ? (
                          <button
                            onClick={() => setViewingPrescription({
                              id: entry.id,
                              label: `N°${entry.numeroOrdre} - ${entry.patient.nomPrenoms}`
                            })}
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Voir</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-4 mb-6">
              {filteredEntries.map(entry => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">N° {entry.numeroOrdre}</span>
                    <span className="text-xs text-gray-600">{new Date(entry.dateDelivrance).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium text-gray-700">Prescripteur:</span> {entry.prescripteur.nomPrenoms} {entry.prescripteur.numeroOrdre && `(N°${entry.prescripteur.numeroOrdre})`}</div>
                    <div><span className="font-medium text-gray-700">Patient:</span> {entry.patient.nomPrenoms}</div>
                    <div><span className="font-medium text-gray-700">Produit:</span> {entry.produit.nature}</div>
                    <div><span className="font-medium text-gray-700">Pharmacien:</span> {entry.pharmacien.nom} {entry.pharmacien.signature && `(N°${entry.pharmacien.signature})`}</div>
                    <div className="flex justify-between">
                      <span><span className="font-medium text-gray-700">Qté:</span> {entry.produit.quantite}</span>
                      <span className="font-semibold" style={{ color: '#009688' }}>{entry.prixVente} FCFA</span>
                    </div>
                  </div>
                  {entry.prescriptionFileUrl && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => setViewingPrescription({
                          id: entry.id,
                          label: `N°${entry.numeroOrdre} - ${entry.patient.nomPrenoms}`
                        })}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Voir l'ordonnance</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-green-700 text-sm sm:text-base"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Télécharger PDF</span>
              </button>
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg text-sm sm:text-base ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{loading ? 'Envoi...' : 'Envoyer à l\'agence'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Paramètres de la Pharmacie</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la pharmacie <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={pharmacyName}
            onChange={(e) => handlePharmacyNameChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
            placeholder="Ex: Pharmacie Camp Guézo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de la pharmacie <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={pharmacyEmail}
            onChange={(e) => setPharmacyEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
            placeholder="pharmacie@example.com"
          />
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-2 border-teal-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-teal-600" />
            <span>Classification Documentaire</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Initiales de la pharmacie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pharmacyInitials}
                onChange={(e) => handleInitialsChange(e.target.value)}
                placeholder="Ex: PCG"
                maxLength={3}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent font-bold uppercase tracking-wider"
                style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-1">
                3 lettres max - Auto-généré
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Code de classification
              </label>
              <div className="bg-white border-2 border-teal-300 rounded-lg px-3 py-2">
                <ClassificationBadge
                  classificationCode="11.02"
                  pharmacyInitials={pharmacyInitials}
                  showFullCode={true}
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={savePharmacySettings}
            className="px-6 py-3 rounded-lg text-white transition-colors duration-200"
            style={{ backgroundColor: '#009688' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
          >
            Enregistrer
          </button>
          <button
            onClick={() => setView('list')}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {view === 'list' && renderList()}
      {view === 'add' && renderAddForm()}
      {view === 'trimester' && renderTrimesterView()}
      {view === 'settings' && renderSettings()}

      {/* Modal de visualisation de l'ordonnance */}
      {viewingPrescription && (
        <PrescriptionViewer
          entryId={viewingPrescription.id}
          entryLabel={viewingPrescription.label}
          onClose={() => setViewingPrescription(null)}
        />
      )}

      {/* Modal de configuration du rapport trimestriel */}
      {showReportConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Configuration du rapport trimestriel
              </h3>
              <button
                onClick={() => {
                  setShowReportConfig(false);
                  setReportConfig({ pharmacistName: '', signatureImage: undefined, stampImage: undefined });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Nom de la pharmacie (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la pharmacie
                </label>
                <input
                  type="text"
                  value={pharmacyName}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>

              {/* Nom du pharmacien */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du pharmacien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportConfig.pharmacistName}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, pharmacistName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
                  placeholder="Ex: Dr. Jean Dupont"
                />
              </div>

              {/* Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature du pharmacien
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={generateDefaultSignature}
                      disabled={!reportConfig.pharmacistName.trim()}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                    >
                      Générer signature par défaut
                    </button>
                    <label className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm cursor-pointer text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReportSignatureUpload(file);
                        }}
                        className="hidden"
                      />
                      Uploader signature
                    </label>
                  </div>

                  {reportConfig.signatureImage && (
                    <div className="relative border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <img src={reportConfig.signatureImage} alt="Signature" className="max-h-20 mx-auto" />
                      <button
                        onClick={() => setReportConfig(prev => ({ ...prev, signatureImage: undefined }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {!reportConfig.signatureImage && reportConfig.pharmacistName && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Aperçu par défaut :</p>
                      <div className="inline-block">
                        <p className="text-2xl" style={{ fontFamily: '\'Dancing Script\', \'Brush Script MT\', cursive', color: '#0066cc' }}>
                          {generateInitialsSignature(reportConfig.pharmacistName)}
                        </p>
                        <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #0066cc 20%, #0066cc 80%, transparent)', borderRadius: '50%', marginTop: '2px' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cachet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cachet du pharmacien
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={generateDefaultStamp}
                      disabled={!reportConfig.pharmacistName.trim()}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                    >
                      Générer cachet par défaut
                    </button>
                    <label className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm cursor-pointer text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReportStampUpload(file);
                        }}
                        className="hidden"
                      />
                      Uploader cachet
                    </label>
                  </div>

                  {reportConfig.stampImage && (
                    <div className="relative border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <img src={reportConfig.stampImage} alt="Cachet" className="max-h-24 mx-auto" />
                      <button
                        onClick={() => setReportConfig(prev => ({ ...prev, stampImage: undefined }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowReportConfig(false);
                  setReportConfig({ pharmacistName: '', signatureImage: undefined, stampImage: undefined });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={reportAction === 'download' ? executeDownloadPDF : executeSendEmail}
                disabled={!reportConfig.pharmacistName.trim() || loading}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Préparation...' : (reportAction === 'download' ? 'Télécharger PDF' : 'Ouvrir Gmail')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdonnancierModule;
