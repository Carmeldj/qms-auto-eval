import React, { useState } from 'react';
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

  const [openMenu, setOpenMenu] = useState(false);


  return (
    <header className="bg-white shadow-md border-b" style={{ borderBottomColor: '#e0f2f1' }}>
      <div className="max-w-7xl ">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2 pl-4">
            <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: '#009688' }}>
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? 'text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  style={isActive ? { backgroundColor: '#009688' } : {}}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="md:hidden p-4 rounded-lg cursor-pointer relative" onClick={() => setOpenMenu(!openMenu)}>
            {!openMenu ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" />
              </svg>
            )}
          </div>

           <div className="md:hidden   absolute top-16 right- z-50 w-full" style={{ display: openMenu ? 'block' : 'none' }}>
            <div className="bg-white rounded-lg shadow-md py-2 ">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(item.id);
                    }
                    setOpenMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 font-medium transition-all duration-200 ${currentSection === item.id
                    ? "text-white bg-[#009688]"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  style={
                    currentSection === item.id
                      ? { backgroundColor: "#009688", color: "white" }
                      : {}
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="md:hidden">
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
              style={{ '--tw-ring-color': '#009688' } as React.CSSProperties}
            >
              {navItems.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
