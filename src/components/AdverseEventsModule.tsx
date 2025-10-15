import React, { useState } from "react";
import { AlertTriangle, Plus, FileText, Download } from "lucide-react";
import AdverseEventForm from "./AdverseEventForm";

const AdverseEventsModule: React.FC = () => {
  const [view, setView] = useState<"list" | "form">("list");

  const handleCreateReport = () => {
    setView("form");
  };

  const handleBackToList = () => {
    setView("list");
  };

  if (view === "form") {
    return <AdverseEventForm onCancel={handleBackToList} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Module PHARMACOVIGILANCE
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Notification des effets/événements indésirables à l'ABMed (Agence
              Béninoise du Médicament)
            </p>
          </div>
          <button
            onClick={handleCreateReport}
            className="flex items-center justify-center space-x-2 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 w-full sm:w-auto"
            style={{ backgroundColor: "#009688" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#00796b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#009688")
            }
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle notification</span>
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-orange-900 mb-2">
              Qu'est-ce que la pharmacovigilance ?
            </h3>
            <p className="text-sm sm:text-base text-orange-800 mb-3">
              La pharmacovigilance est l'ensemble des activités relatives à la
              détection, l'évaluation, la compréhension et la prévention des
              effets indésirables ou de tout autre problème lié aux médicaments.
            </p>
            <p className="text-sm sm:text-base text-orange-800 font-medium">
              Tout professionnel de santé a l'obligation de notifier les effets
              indésirables observés à l'ABMed.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Notifications créées</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">0</div>
          <div className="text-sm text-gray-600">En attente d'envoi</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <Download className="h-8 w-8" style={{ color: "#009688" }} />
          <div className="text-2xl font-bold" style={{ color: "#009688" }}>
            0
          </div>
          <div className="text-sm text-gray-600">Rapports générés</div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
        <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Aucune notification enregistrée
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Commencez par créer votre première notification d'effet indésirable
          pour la soumettre à l'ABMed.
        </p>
        <button
          onClick={handleCreateReport}
          className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: "#009688" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#00796b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#009688")
          }
        >
          <Plus className="h-5 w-5" />
          <span>Créer une notification</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
        <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-3">
          Comment utiliser ce module
        </h3>
        <div className="space-y-2 text-sm sm:text-base text-blue-800">
          <p>
            1. <strong>Remplissez</strong> le formulaire de notification avec
            toutes les informations disponibles
          </p>
          <p>
            2. <strong>Vérifiez</strong> l'exactitude des données saisies
            (patient, produit, événement)
          </p>
          <p>
            3. <strong>Générez</strong> automatiquement le PDF conforme au
            format officiel ABMed
          </p>
          <p>
            4. <strong>Envoyez</strong> le rapport à l'ABMed via email ou
            courrier officiel
          </p>
        </div>
      </div>

      {/* Contact ABMed */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6 sm:mt-8">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
          Contact ABMed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Téléphone</p>
            <p className="text-gray-900">(229) 01 51 45 79 87</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Email</p>
            <p className="text-gray-900">contact.abmed@gouv.bj</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Site web</p>
            <p className="text-gray-900">www.abmed.bj</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Adresse</p>
            <p className="text-gray-900">Guinkomey, rue 108, Cotonou, Bénin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdverseEventsModule;
