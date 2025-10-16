import React from 'react';
import { Stethoscope } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onNavigate?: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'assessment', label: 'Évaluation' },
    { id: 'inspection', label: 'Inspection' },
    { id: 'documents', label: 'Documents' },
    { id: 'procedures', label: 'Procédures' },
    { id: 'traceability', label: 'Traçabilité' },
    { id: 'pharmacovigilance', label: 'Pharmacovigilance' },
    { id: 'ordonnancier', label: 'Ordonnancier' }
  ];

  const handleNav = (id: string) => {
    const path = id === 'home' ? '/' : `/${id}`;
    if (onNavigate) onNavigate(id);
    navigate(path);
  };

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
              const path = item.id === 'home' ? '/' : `/${item.id}`;
              const isActive = location.pathname === path || (item.id === 'assessment' && location.pathname === '/results') || (item.id === 'inspection' && location.pathname === '/inspection-results') || (item.id === 'home' && (location.pathname === '/swot' || location.pathname === '/pestel'));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={isActive ? {backgroundColor: '#009688'} : {}}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="md:hidden">
            <select
              value={(() => {
                const p = location.pathname;
                if (p === '/results') return 'assessment';
                if (p === '/inspection-results') return 'inspection';
                if (p === '/swot' || p === '/pestel') return 'home';
                return p === '/' ? 'home' : p.replace(/^\//, '');
              })()}
              onChange={(e) => handleNav(e.target.value)}
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
