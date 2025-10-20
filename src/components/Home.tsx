import React from 'react';
import { ClipboardList, TrendingUp, Users, Shield, BarChart3, BookOpen, MessageCircle, Search, FileText, Database, FolderOpen, Target, Globe } from 'lucide-react';
import { pmqCategories } from '../data/principles';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      icon: ClipboardList,
      title: "29 Principes Qualité",
      description: "Évaluation complète selon les 7 PMQ ISO 9001"
    },
    {
      icon: Search,
      title: "Auto-inspection",
      description: "Vérification de conformité réglementaire et opérationnelle"
    },
    {
      icon: FileText,
      title: "Rédaction Procédures",
      description: "Création guidée de procédures officinales standardisées"
    },
    {
      icon: Database,
      title: "Traçabilité",
      description: "Registres officiels avec export PDF pour la traçabilité"
    },
    {
      icon: FolderOpen,
      title: "Documents",
      description: "Génération de documents officiels (organigrammes, fiches, certificats)"
    },
    {
      icon: BarChart3,
      title: "Scoring Automatisé",
      description: "Calcul automatique des scores par principe et PMQ"
    },
  ];

  const pmqIcons = [Users, Shield, MessageCircle, ClipboardList, TrendingUp, BarChart3, BookOpen];

  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="mt-8 text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Évaluez votre <span style={{ color: '#009688' }}>PHARMA QMS</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 sm:px-4">
          Outil d'autoévaluation professionnel pour les pharmacies d'officine basé sur les 29 principes
          qualité structurés selon les 7 PMQ ISO 9001.
        </p>

        <div className="flex flex-col gap-3 sm:gap-4 items-center px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
            <button
              onClick={() => {
                navigate('/assessment');
              }}
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#009688' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
            >
              Commencer l'évaluation
            </button>

            <button
              onClick={() => {
                navigate('/inspection');
              }}
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#ff5722' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e64a19'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff5722'}
            >
              Démarrer l'inspection
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={() => {
                navigate('/swot');
              }}
              className="flex items-center justify-center space-x-2 bg-white border-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm  transform hover:scale-105 active:scale-95 transition-all duration-200 shadow hover:shadow-md"
              style={{ borderColor: '#4caf50', color: '#4caf50' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4caf50';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#4caf50';
              }}
            >
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Analyse SWOT</span>
            </button>

            <button
              onClick={() => {
                navigate('/pestel');
              }}
              className="flex items-center justify-center space-x-2 bg-white border-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm  transform hover:scale-105 active:scale-95 transition-all duration-200 shadow hover:shadow-md"
              style={{ borderColor: '#2196f3', color: '#2196f3' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2196f3';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#2196f3';
              }}
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Analyse PESTEL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4" style={{ backgroundColor: '#e0f2f1' }}>
              <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#009688' }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{feature.title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* PMQ Categories */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          Les 7 PMQ ISO 9001
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pmqCategories.map((pmq, index) => {
            const IconComponent = pmqIcons[index] || ClipboardList;
            return (
              <div key={pmq.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e0f2f1' }}>
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#009688' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {pmq.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{pmq.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-xl p-6 sm:p-8 text-center mt-8 sm:mt-12" style={{ background: 'linear-gradient(to right, #009688, #00bcd4)' }}>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
          Prêt à évaluer votre SMQ ?
        </h2>
        <p className="mb-4 sm:mb-6 px-2 sm:px-4 text-sm sm:text-base" style={{ color: '#b2dfdb' }}>
          L'évaluation prend environ 15-20 minutes et génère automatiquement votre plan d'amélioration personnalisé.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <button
            onClick={() => {
              navigate('/assessment');
            }}
            className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ color: '#009688' }}
          >
            Démarrer maintenant
          </button>
          <button
            onClick={() => {
              navigate('/inspection');
            }}
            className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ color: '#ff5722' }}
          >
            Inspection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
