import React, { useState, useEffect } from "react";
import {
  Download,
  Plus,
  FileText,
  Calendar,
  Settings,
  List,
  Mail,
} from "lucide-react";
import {
  OrdonnancierEntry,
  PRODUITS_SOUS_CONTROLE,
  TRIMESTRES,
} from "../types/ordonnancier";
import { ordonnancierService } from "../services/OrdonnancierService";
import { uploadAndSaveDocument } from "../utils/documentUploadHelper";
import { DocumentAccessLevel, DocumentStatus } from "../types/documents";
import { useAuth } from "../contexts/AuthContext";
import ClassificationBadge from "./ClassificationBadge";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const OrdonnancierModule: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<"list" | "add" | "trimester" | "settings">(
    "list"
  );
  const [entries, setEntries] = useState<OrdonnancierEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<OrdonnancierEntry[]>(
    []
  );
  const [selectedTrimester, setSelectedTrimester] = useState<number>(
    getCurrentTrimester()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState(false);
  const [pharmacyName, setPharmacyName] = useState<string>("");
  const [pharmacyInitials, setPharmacyInitials] = useState<string>("");
  const [pharmacyEmail, setPharmacyEmail] = useState<string>("");

  const handlePharmacyNameChange = (value: string) => {
    setPharmacyName(value);
    if (value.trim()) {
      const words = value.trim().split(/\s+/);
      const autoInitials = words
        .map((w) => w[0])
        .join("")
        .substring(0, 3)
        .toUpperCase();
      setPharmacyInitials(autoInitials);
    }
  };

  const handleInitialsChange = (value: string) => {
    const sanitized = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .substring(0, 3);
    setPharmacyInitials(sanitized);
  };

  const [formData, setFormData] = useState<Partial<OrdonnancierEntry>>({
    dateDelivrance: new Date().toISOString().split("T")[0],
    prescripteur: { nomPrenoms: "", numeroOrdre: "" },
    patient: { nomPrenoms: "", adresse: "" },
    produit: { nature: "", dose: "", quantite: 1 },
    prixVente: 0,
    pharmacien: { nom: "", signature: "" },
  });

  const [isCustomProduct, setIsCustomProduct] = useState(false);

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
    const savedName = localStorage.getItem("pharmacyName");
    const savedInitials = localStorage.getItem("pharmacyInitials");
    const savedEmail = localStorage.getItem("pharmacyEmail");

    if (savedName) setPharmacyName(savedName);
    if (savedInitials) setPharmacyInitials(savedInitials);
    if (savedEmail) setPharmacyEmail(savedEmail);
  };

  const savePharmacySettings = () => {
    localStorage.setItem("pharmacyName", pharmacyName);
    localStorage.setItem("pharmacyInitials", pharmacyInitials);
    localStorage.setItem("pharmacyEmail", pharmacyEmail);
    alert("Paramètres sauvegardés avec succès!");
  };

  const loadEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/ordonnancier_entries?order=date_delivrance.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const mappedEntries: OrdonnancierEntry[] = data.map((item: any) => ({
          id: item.id,
          numeroOrdre: item.numero_ordre,
          dateDelivrance: item.date_delivrance,
          prescripteur: {
            nomPrenoms: item.prescripteur_nom_prenoms,
            numeroOrdre: item.prescripteur_numero_ordre,
          },
          patient: {
            nomPrenoms: item.patient_nom_prenoms,
            adresse: item.patient_adresse,
          },
          produit: {
            nature: item.produit_nature,
            dose: item.produit_dose,
            quantite: item.produit_quantite,
          },
          prixVente: item.prix_vente,
          pharmacien: {
            nom: item.pharmacien_nom,
            signature: item.pharmacien_signature,
          },
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        setEntries(mappedEntries);
      }
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntriesByTrimester = () => {
    const filtered = entries.filter((entry) => {
      const date = new Date(entry.dateDelivrance);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const trimestre = Math.ceil(month / 3);

      return trimestre === selectedTrimester && year === selectedYear;
    });
    setFilteredEntries(filtered);
  };

  const handleDownloadPDF = async () => {
    if (!pharmacyName.trim()) {
      alert("Veuillez configurer le nom de la pharmacie dans les paramètres");
      return;
    }

    try {
      // Generate PDF and get blob
      const result = await ordonnancierService.generateTrimesterPDF(
        filteredEntries,
        selectedTrimester,
        selectedYear,
        pharmacyName,
        pharmacyInitials
      );
      const { blob, fileName } = result;

      // Upload and save to API
      const trimestreInfo = TRIMESTRES.find(
        (t) => t.numero === selectedTrimester
      );
      await uploadAndSaveDocument(blob, fileName, {
        title: `Ordonnancier - ${trimestreInfo?.label} ${selectedYear}`,
        type: "ordonnancier",
        category: "Ordonnancier",
        description: `Carnet d'ordonnancier pour le ${trimestreInfo?.label} ${selectedYear} - ${filteredEntries.length} délivrances`,
        author: user?.name || user?.email || pharmacyName,
        version: "1.0",
        accessLevel: DocumentAccessLevel.RESTRICTED,
        status: DocumentStatus.PUBLISHED,
        tags: [
          "ordonnancier",
          `T${selectedTrimester}`,
          `${selectedYear}`,
          pharmacyName,
        ],
      });

      // Also trigger download for user
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF");
    }
  };

  // const handleSendEmail = async () => {
  //   if (filteredEntries.length === 0) {
  //     alert('Aucune délivrance à envoyer pour ce trimestre');
  //     return;
  //   }

  //   const confirmed = window.confirm(
  //     `Voulez-vous envoyer le rapport trimestriel (${filteredEntries.length} délivrances) à l'ABMed?`
  //   );

  //   if (!confirmed) return;

  //   if (!pharmacyName.trim() || !pharmacyEmail.trim()) {
  //     alert('Veuillez configurer le nom et l\'email de la pharmacie dans les paramètres');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await ordonnancierService.sendTrimesterReport(
  //       filteredEntries,
  //       selectedTrimester,
  //       selectedYear,
  //       pharmacyName,
  //       pharmacyEmail,
  //       pharmacyInitials
  //     );
  //     alert('Rapport envoyé avec succès à l\'ABMed!');
  //   } catch (error) {
  //     console.error('Error sending report:', error);
  //     alert('Erreur lors de l\'envoi du rapport. Veuillez réessayer.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
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
      };

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/ordonnancier_entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Entrée enregistrée avec succès!");
        setFormData({
          dateDelivrance: new Date().toISOString().split("T")[0],
          prescripteur: { nomPrenoms: "", numeroOrdre: "" },
          patient: { nomPrenoms: "", adresse: "" },
          produit: { nature: "", dose: "", quantite: 1 },
          prixVente: 0,
          pharmacien: { nom: "", signature: "" },
        });
        setIsCustomProduct(false);
        await loadEntries();
        setView("list");
      } else {
        throw new Error("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Registre Ordonnancier
        </h2>
        <button
          onClick={() => setView("add")}
          className="flex items-center space-x-2 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
          style={{ backgroundColor: "#009688" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#00796b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#009688")
          }
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle délivrance</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setView("trimester")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Rapport Trimestriel</span>
          </button>
          <button
            onClick={() => setView("settings")}
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
            <p className="text-gray-600 text-sm sm:text-base">
              Aucune délivrance enregistrée
            </p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      N°
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Prescripteur
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.slice(0, 20).map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{entry.numeroOrdre}</td>
                      <td className="px-4 py-3">
                        {new Date(entry.dateDelivrance).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {entry.prescripteur.nomPrenoms}
                      </td>
                      <td className="px-4 py-3">{entry.patient.nomPrenoms}</td>
                      <td className="px-4 py-3">{entry.produit.nature}</td>
                      <td className="px-4 py-3">{entry.produit.quantite}</td>
                      <td className="px-4 py-3">{entry.prixVente} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-4">
              {entries.slice(0, 20).map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">
                      N° {entry.numeroOrdre}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(entry.dateDelivrance).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium text-gray-700">
                        Prescripteur:
                      </span>{" "}
                      {entry.prescripteur.nomPrenoms}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Patient:
                      </span>{" "}
                      {entry.patient.nomPrenoms}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Produit:
                      </span>{" "}
                      {entry.produit.nature}
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <span className="font-medium text-gray-700">Qté:</span>{" "}
                        {entry.produit.quantite}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#009688" }}
                      >
                        {entry.prixVente} FCFA
                      </span>
                    </div>
                  </div>
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Nouvelle Délivrance
          </h2>
          <button
            onClick={() => setView("list")}
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
              onChange={(e) =>
                setFormData({ ...formData, dateDelivrance: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Prescripteur
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom et prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prescripteur?.nomPrenoms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prescripteur: {
                        ...formData.prescripteur!,
                        nomPrenoms: e.target.value,
                      },
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prescripteur: {
                        ...formData.prescripteur!,
                        numeroOrdre: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom et prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patient?.nomPrenoms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patient: {
                        ...formData.patient!,
                        nomPrenoms: e.target.value,
                      },
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patient: {
                        ...formData.patient!,
                        adresse: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Produit
            </h3>
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
                            produit: { ...formData.produit!, nature: "" },
                          });
                        }}
                        className="w-4 h-4"
                        style={{ accentColor: "#009688" }}
                      />
                      <span className="text-sm text-gray-700">
                        Sélectionner dans la liste
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={isCustomProduct}
                        onChange={() => {
                          setIsCustomProduct(true);
                          setFormData({
                            ...formData,
                            produit: { ...formData.produit!, nature: "" },
                          });
                        }}
                        className="w-4 h-4"
                        style={{ accentColor: "#009688" }}
                      />
                      <span className="text-sm text-gray-700">
                        Saisir manuellement
                      </span>
                    </label>
                  </div>

                  {!isCustomProduct ? (
                    <select
                      required
                      value={formData.produit?.nature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          produit: {
                            ...formData.produit!,
                            nature: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Sélectionner...</option>
                      {PRODUITS_SOUS_CONTROLE.map((produit) => (
                        <option key={produit} value={produit}>
                          {produit}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Entrer le nom du produit"
                      value={formData.produit?.nature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          produit: {
                            ...formData.produit!,
                            nature: e.target.value,
                          },
                        })
                      }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        produit: { ...formData.produit!, dose: e.target.value },
                      })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        produit: {
                          ...formData.produit!,
                          quantite: parseInt(e.target.value),
                        },
                      })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prixVente: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pharmacien
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du pharmacien *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pharmacien?.nom}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pharmacien: {
                        ...formData.pharmacien!,
                        nom: e.target.value,
                      },
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pharmacien: {
                        ...formData.pharmacien!,
                        signature: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: 123/BEN"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
              style={{ backgroundColor: loading ? "#ccc" : "#009688" }}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Rapport Trimestriel
          </h2>
          <button
            onClick={() => setView("list")}
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
              {TRIMESTRES.map((t) => (
                <option key={t.numero} value={t.numero}>
                  {t.label}
                </option>
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
            <strong>Période:</strong>{" "}
            {TRIMESTRES.find((t) => t.numero === selectedTrimester)?.label}{" "}
            {selectedYear}
          </p>
          <p className="text-xs sm:text-sm text-blue-900 mt-2">
            <strong>Total de délivrances:</strong> {filteredEntries.length}
          </p>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">
              Aucune délivrance pour ce trimestre
            </p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      N°
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Prescripteur
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{entry.numeroOrdre}</td>
                      <td className="px-4 py-3">
                        {new Date(entry.dateDelivrance).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {entry.prescripteur.nomPrenoms}
                      </td>
                      <td className="px-4 py-3">{entry.patient.nomPrenoms}</td>
                      <td className="px-4 py-3">{entry.produit.nature}</td>
                      <td className="px-4 py-3">{entry.produit.quantite}</td>
                      <td className="px-4 py-3">{entry.prixVente} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-4 mb-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">
                      N° {entry.numeroOrdre}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(entry.dateDelivrance).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium text-gray-700">
                        Prescripteur:
                      </span>{" "}
                      {entry.prescripteur.nomPrenoms}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Patient:
                      </span>{" "}
                      {entry.patient.nomPrenoms}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Produit:
                      </span>{" "}
                      {entry.produit.nature}
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <span className="font-medium text-gray-700">Qté:</span>{" "}
                        {entry.produit.quantite}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#009688" }}
                      >
                        {entry.prixVente} FCFA
                      </span>
                    </div>
                  </div>
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
              {/* <button
                onClick={handleSendEmail}
                disabled={loading}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg text-sm sm:text-base ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{loading ? 'Envoi...' : 'Envoyer à ABMed'}</span>
              </button> */}
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  if (filteredEntries.length === 0) {
                    alert("Aucune délivrance à envoyer pour ce trimestre");
                    return;
                  }

                  // Pre-fill mailto (attachments aren't supported via mailto)
                  const toPrompt = window.prompt(
                    "Entrez l'adresse email de l'agence :",
                    "abmed@abmed.bj"
                  );
                  if (!toPrompt) {
                    alert("Adresse email non fournie. Opération annulée.");
                    return;
                  }
                  const to = toPrompt.trim();
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(to)) {
                    alert("Adresse email invalide. Veuillez réessayer.");
                    return;
                  }
                  const subject = `${pharmacyName} - Rapport Trimestriel ${
                    TRIMESTRES.find((t) => t.numero === selectedTrimester)
                      ?.label
                  } ${selectedYear}`;
                  const body = [
                    `Bonjour,`,
                    `Veuillez trouver ci-joint le rapport trimestriel ${
                      TRIMESTRES.find((t) => t.numero === selectedTrimester)
                        ?.label
                    } ${selectedYear}.`,
                    ``,
                    `Cordialement.`,
                  ].join("\n");

                  const mailto = `mailto:${encodeURIComponent(
                    to
                  )}?subject=${encodeURIComponent(
                    subject
                  )}&body=${encodeURIComponent(body)}`;
                  window.location.href = mailto;
                }}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg active:scale-95 transition-all duration-200 ${
                  filteredEntries.length > 0
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                aria-disabled="true"
              >
                <Mail className="h-4 w-4" />
                <span>Envoyez à l'agence sanitaire</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Paramètres de la Pharmacie
      </h2>

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
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
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
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
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
                Initiales de la pharmacie{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pharmacyInitials}
                onChange={(e) => handleInitialsChange(e.target.value)}
                placeholder="Ex: PCG"
                maxLength={3}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent font-bold uppercase tracking-wider"
                style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
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
            style={{ backgroundColor: "#009688" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#00796b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#009688")
            }
          >
            Enregistrer
          </button>
          <button
            onClick={() => setView("list")}
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
      {view === "list" && renderList()}
      {view === "add" && renderAddForm()}
      {view === "trimester" && renderTrimesterView()}
      {view === "settings" && renderSettings()}
    </div>
  );
};

export default OrdonnancierModule;
