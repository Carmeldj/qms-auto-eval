import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

const ProcessMapping: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
        Cartographie des Processus
      </h2>

      <div className="relative">
        {/* Parties prenantes externes */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch mb-2 gap-2 sm:gap-4">
          <div className="relative border-2 border-gray-800 rounded-lg p-3 sm:p-4 bg-white flex items-center justify-center">
            <p className="text-xs font-bold text-gray-900 text-center leading-tight">
              Écoute du marché, des exigences, risques et opportunités
            </p>
            {/* Flèche sortante vers le bas depuis Écoute du marché */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <ArrowDown className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <div className="flex-1 mx-4">
            <div className="h-px"></div>
          </div>

          <div className="relative border-2 border-gray-800 rounded-lg p-3 sm:p-4 bg-white flex items-center justify-center">
            <p className="text-xs font-bold text-gray-900 text-center">
              Satisfaction client
            </p>
            {/* Flèche entrante du bas vers Satisfaction client */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <ArrowUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Espace pour les flèches verticales */}
        <div className="h-4"></div>

        {/* Conteneur principal */}
        <div className="relative border-2 border-gray-800 rounded-2xl p-3 sm:p-4 md:p-6 bg-white overflow-x-auto">
          {/* PROCESSUS DE MANAGEMENT */}
          <div className="mb-8">
            <div className="border-2 border-gray-800 rounded-xl p-3 sm:p-4 bg-white">
              <h3 className="text-center font-bold text-gray-900 mb-4">
                Processus de « management »
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    01 - Direction
                  </p>
                </div>
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    02 - Gestion de la qualité
                  </p>
                </div>
              </div>

              {/* Flèches descendantes */}
              <div className="flex justify-around mt-2">
                <ArrowDown className="h-6 w-6 text-blue-500" />
                <ArrowDown className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* PROCESSUS OPÉRATIONNELS */}
          <div className="mb-8">
            <div className="border-2 border-gray-800 rounded-xl p-3 sm:p-4 bg-white">
              <h3 className="text-center font-bold text-gray-900 mb-4">
                Processus « opérationnels »
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    03 - Approvisionnement
                  </p>
                </div>
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    04 - Dispensation
                  </p>
                </div>
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center relative">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    05 - Retours / Réclamations
                  </p>
                  {/* Flèche de retour */}
                  <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
                    <ArrowUp className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    06 - Destruction des périmés
                  </p>
                </div>
              </div>

              {/* Flèches de liaison horizontales */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <ArrowRight className="h-5 w-5 text-blue-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* PROCESSUS SUPPORT */}
          <div>
            {/* Flèches montantes */}
            <div className="flex justify-around mb-2">
              <ArrowUp className="h-6 w-6 text-blue-500" />
              <ArrowUp className="h-6 w-6 text-blue-500" />
              <ArrowUp className="h-6 w-6 text-blue-500" />
              <ArrowUp className="h-6 w-6 text-blue-500" />
            </div>

            <div className="border-2 border-gray-800 rounded-xl p-3 sm:p-4 bg-white">
              <h3 className="text-center font-bold text-gray-900 mb-4">
                Processus « support »
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    07 - Gestion des RH
                  </p>
                </div>
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    08 - Gestion des infrastructures
                  </p>
                </div>
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    09 - Gestion financière et comptabilité
                  </p>
                </div>
                <div className="border border-gray-600 rounded-lg p-3 bg-white min-h-[80px] flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    10 - Sous-traitance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 sm:mt-8 border border-gray-300 rounded-lg p-3 sm:p-4 bg-white">
          <h4 className="font-bold text-gray-900 mb-3 text-sm">Légende :</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs text-gray-700">
            <div>
              <p className="font-medium mb-1">Processus de Management</p>
              <p>Pilotage stratégique et décisionnel</p>
            </div>
            <div>
              <p className="font-medium mb-1">Processus Opérationnels</p>
              <p>Activités cœur de métier créant de la valeur</p>
            </div>
            <div>
              <p className="font-medium mb-1">Processus Support</p>
              <p>Ressources nécessaires aux processus opérationnels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessMapping;
