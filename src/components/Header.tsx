import React from 'react';
import { Stethoscope } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'assessment', label: 'Évaluation' },
    { id: 'inspection', label: 'Inspection' },
    { id: 'documents', label: 'Documents' },
    { id: 'procedures', label: 'Procédures' },
    { id: 'traceability', label: 'Traçabilité' },
    { id: 'pharmacovigilance', label: 'Pharmacovigilance' },
    { id: 'ordonnancier', label: 'Ordonnancier' },
    { id: 'waste-management', label: 'Périmés' }
  ];

  return (
    <header className="bg-white shadow-md border-b" style={{borderBottomColor: '#e0f2f1'}}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 sm:p-2 rounded-lg" style={{backgroundColor: '#009688'}}>
              <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">PHARMA QMS</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">Système de Management de la Qualité</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navItems.map(item => {
              const isActive = currentSection === item.id ||
                (item.id === 'assessment' && currentSection === 'results') ||
                (item.id === 'inspection' && currentSection === 'inspection-results') ||
                (item.id === 'home' && (currentSection === 'swot' || currentSection === 'pestel'));

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={isActive ? {backgroundColor: '#009688'} : {}}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#009688';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '';
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="md:hidden">
            <select
              value={currentSection === 'results' ? 'assessment' :
                     currentSection === 'inspection-results' ? 'inspection' :
                     currentSection === 'swot' || currentSection === 'pestel' ? 'home' :
                     currentSection}
              onChange={(e) => onNavigate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
            >
              {navItems.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
