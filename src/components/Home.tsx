import React from "react";
import {
  ClipboardList,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  BookOpen,
  MessageCircle,
  Search,
  FileText,
  Database,
  FolderOpen,
} from "lucide-react";
import { pmqCategories } from "../data/principles";

interface HomeProps {
  onStartAssessment: () => void;
  onStartInspection: () => void;
}

const Home: React.FC<HomeProps> = ({
  onStartAssessment,
  onStartInspection,
}) => {
  const features = [
    {
      icon: ClipboardList,
      title: "29 Principes Qualité",
      description: "Évaluation complète selon les 7 PMQ ISO 9001",
    },
    {
      icon: Search,
      title: "Auto-inspection",
      description: "Vérification de conformité réglementaire et opérationnelle",
    },
    {
      icon: FileText,
      title: "Rédaction Procédures",
      description: "Création guidée de procédures officinales standardisées",
    },
    {
      icon: Database,
      title: "Traçabilité",
      description: "Registres officiels avec export PDF pour la traçabilité",
    },
    {
      icon: FolderOpen,
      title: "Documents",
      description:
        "Génération de documents officiels (organigrammes, fiches, certificats)",
    },
    {
      icon: BarChart3,
      title: "Scoring Automatisé",
      description: "Calcul automatique des scores par principe et PMQ",
    },
  ];

  const pmqIcons = [
    Users,
    Shield,
    MessageCircle,
    ClipboardList,
    TrendingUp,
    BarChart3,
    BookOpen,
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Évaluez votre <span style={{ color: "#009688" }}>PHARMA QMS</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
          Outil d'autoévaluation professionnel pour les pharmacies d'officine
          basé sur les 29 principes qualité structurés selon les 7 PMQ ISO 9001.
        </p>

        <button
          onClick={onStartAssessment}
          className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: "#009688" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#00796b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#009688")
          }
        >
          Commencer l'évaluation
        </button>

        <button
          onClick={onStartInspection}
          className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ml-4"
          style={{ backgroundColor: "#ff5722" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e64a19")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#ff5722")
          }
        >
          Démarrer l'inspection
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div
              className="p-3 rounded-lg w-fit mb-4"
              style={{ backgroundColor: "#e0f2f1" }}
            >
              <feature.icon className="h-6 w-6" style={{ color: "#009688" }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* PMQ Categories */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Les 7 PMQ ISO 9001
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pmqCategories.map((pmq, index) => {
            const IconComponent = pmqIcons[index] || ClipboardList;
            return (
              <div
                key={pmq.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#e0f2f1" }}
                  >
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: "#009688" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      PMQ {pmq.id} - {pmq.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {pmq.description}
                    </p>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#e0f2f1", color: "#009688" }}
                    >
                      {pmq.principleCount} principes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="rounded-xl p-8 text-center mt-12"
        style={{ background: "linear-gradient(to right, #009688, #00bcd4)" }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Prêt à évaluer votre SMQ ?
        </h2>
        <p className="mb-6 px-4" style={{ color: "#b2dfdb" }}>
          L'évaluation prend environ 15-20 minutes et génère automatiquement
          votre plan d'amélioration personnalisé.
        </p>
        <button
          onClick={onStartAssessment}
          className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
          style={{ color: "#009688" }}
        >
          Démarrer maintenant
        </button>
        <button
          onClick={onStartInspection}
          className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 ml-4"
          style={{ color: "#ff5722" }}
        >
          Inspection
        </button>
      </div>
    </div>
  );
};

export default Home;
