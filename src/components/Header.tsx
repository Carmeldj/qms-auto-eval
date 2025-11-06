import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    // { id: 'home', label: 'Accueil' },
    { id: 'assessment', label: 'Évaluation' },
    { id: 'inspection', label: 'Inspection' },
    { id: 'documents', label: 'Documents' },
    { id: 'procedures', label: 'Procédures' },
    { id: 'traceability', label: 'Traçabilité' },
    { id: 'pharmacovigilance', label: 'Pharmacovigilance' },
    { id: 'ordonnancier', label: 'Ordonnancier' },
    { id: 'waste-management', label: 'Périmés' }
  ];

  const handleNav = (id: string) => {
    const path = id === 'home' ? '/' : `/${id}`;
    navigate(path);
  };

  const [openMenu, setOpenMenu] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { openModal } = useApp();

  return (
    <header className="bg-white shadow-md border-b py-2" style={{ borderBottomColor: '#e0f2f1' }}>
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex justify-between items-center py-3">
          <div className="w-48 flex items-center space-x-2 pl-4 cursor-pointer" onClick={() => navigate('/')}>
            {/* <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: '#009688' }}>
              <Stethoscope className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text- font-bold text-gray-900">PHARMA QMS</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">Système de Management de la Qualité</p>
            </div> */}
            <img
              src="/logo.png"
              alt="PHARMA QMS"
              className=""
            />
          </div>


          {isAuthenticated ? (
            <>
              <nav className="hidden lg:flex space-x-1 text-sm">
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


              <div className="lg:hidden p-4 rounded-lg cursor-pointer relative" onClick={() => setOpenMenu(!openMenu)}>
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

              <div className="md:hidden absolute top-24 right-0 z-50 w-full" style={{ display: openMenu ? 'block' : 'none' }}>
                <div className="bg-white rounded-lg shadow-md py-2 ">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setOpenMenu(false);
                        handleNav(item.id);
                      }}
                      className={`block w-full text-left px-4 py-2 font-medium transition-all duration-200 ${(item.id === 'home' ? location.pathname === '/' : location.pathname === `/${item.id}`) ||
                        (item.id === 'assessment' && location.pathname === '/results') ||
                        (item.id === 'inspection' && location.pathname === '/inspection-results') ||
                        (item.id === 'home' && (location.pathname === '/swot' || location.pathname === '/pestel'))
                        ? "text-white bg-[#009688]"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                      style={
                        (item.id === 'home' ? location.pathname === '/' : location.pathname === `/${item.id}`) ||
                          (item.id === 'assessment' && location.pathname === '/results') ||
                          (item.id === 'inspection' && location.pathname === '/inspection-results') ||
                          (item.id === 'home' && (location.pathname === '/swot' || location.pathname === '/pestel'))
                          ? { backgroundColor: "#009688", color: "white" }
                          : {}
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="rounded-lg block w-full text-left px-4 py-2 font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 rounded-lg font-medium text-white text-sm mr-4"
                style={{ backgroundColor: '#009688' }}
                onClick={() => {
                  // e.stopPropagation();
                  openModal('login');
                }}
              >
                Se connecter
              </button>
            </>
          )}

          {isAuthenticated && <button
            onClick={logout}
            className="hidden w-max rounded-lg lg:block text-sm px-4 py-2 font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            Se déconnecter
          </button>}

        </div>
      </div>
    </header>
  );
};

export default Header;
