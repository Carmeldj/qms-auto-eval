import React from "react";
import {
  OrdonnancierEntry,
  PRODUITS_SOUS_CONTROLE,
} from "../types/ordonnancier";

interface OrdonnancierFormFieldsProps {
  formData: Partial<OrdonnancierEntry>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<OrdonnancierEntry>>>;
  isCustomProduct: boolean;
  setIsCustomProduct: (value: boolean) => void;
}

const OrdonnancierFormFields: React.FC<OrdonnancierFormFieldsProps> = ({
  formData,
  setFormData,
  isCustomProduct,
  setIsCustomProduct,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de prescription *
          </label>
          <input
            type="date"
            required
            value={formData.datePrescription}
            onChange={(e) =>
              setFormData({ ...formData, datePrescription: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de dispensation *
          </label>
          <input
            type="date"
            required
            value={formData.dateDispensation}
            onChange={(e) =>
              setFormData({ ...formData, dateDispensation: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
          />
        </div>
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
              N° Ordre / Contact *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: N°12345 / 97001234"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
            <input
              type="text"
              placeholder="Téléphone ou email"
              value={formData.prescripteur?.contact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prescripteur: {
                    ...formData.prescripteur!,
                    contact: e.target.value,
                  },
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualité du prescripteur
            </label>
            <input
              type="text"
              placeholder="Ex: Médecin généraliste, Dentiste..."
              value={formData.prescripteur?.qualite}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prescripteur: {
                    ...formData.prescripteur!,
                    qualite: e.target.value,
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
          Formation Sanitaire
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formation sanitaire ayant prescrite l'ordonnance
          </label>
          <input
            type="text"
            placeholder="Ex: Hôpital de zone, Centre de santé..."
            value={formData.formationSanitaire}
            onChange={(e) =>
              setFormData({ ...formData, formationSanitaire: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Patient / Mandataire
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom et contact du malade ou de la personne mandatée par le
              dispensateur *
            </label>
            <input
              type="text"
              required
              placeholder="Nom complet"
              value={formData.patient?.nomPrenoms}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  patient: { ...formData.patient!, nomPrenoms: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
            <input
              type="text"
              placeholder="Téléphone"
              value={formData.patient?.contact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  patient: { ...formData.patient!, contact: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Prescription
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spécialités, DCI et Présentation *
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
                        produit: { ...formData.produit!, specialiteDCI: "" },
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
                        produit: { ...formData.produit!, specialiteDCI: "" },
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
                  value={formData.produit?.specialiteDCI}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      produit: {
                        ...formData.produit!,
                        specialiteDCI: e.target.value,
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
                  placeholder="Ex: Morphine sulfate"
                  value={formData.produit?.specialiteDCI}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      produit: {
                        ...formData.produit!,
                        specialiteDCI: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Présentation
            </label>
            <input
              type="text"
              placeholder="Ex: Boîte de 10 comprimés, Flacon 50ml..."
              value={formData.produit?.presentation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  produit: {
                    ...formData.produit!,
                    presentation: e.target.value,
                  },
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forme galénique
              </label>
              <input
                type="text"
                placeholder="Ex: Comprimé, Sirop, Injectable..."
                value={formData.produit?.formeGalenique}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    produit: {
                      ...formData.produit!,
                      formeGalenique: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage
              </label>
              <input
                type="text"
                placeholder="Ex: 10mg, 500mg/5ml..."
                value={formData.produit?.dosage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    produit: { ...formData.produit!, dosage: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité délivrée *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.produit?.quantiteDelivree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    produit: {
                      ...formData.produit!,
                      quantiteDelivree: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liste (I ou II) *
              </label>
              <select
                required
                value={formData.produit?.liste || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    produit: {
                      ...formData.produit!,
                      liste:
                        e.target.value === ""
                          ? null
                          : (e.target.value as "I" | "II"),
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Sélectionner...</option>
                <option value="I">Liste I</option>
                <option value="II">Liste II</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.prixUnitaire}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prixUnitaire: parseFloat(e.target.value) || 0,
                  })
                }
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pharmacien: { ...formData.pharmacien!, nom: e.target.value },
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
    </div>
  );
};

export default OrdonnancierFormFields;
