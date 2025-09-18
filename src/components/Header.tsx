import React from "react";
import { Stethoscope } from "lucide-react";

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const navItems = [
    { id: "home", label: "Accueil" },
    { id: "assessment", label: "Évaluation" },
    { id: "inspection", label: "Inspection" },
    { id: "documents", label: "Documents" },
    { id: "procedures", label: "Procédures" },
    { id: "traceability", label: "Traçabilité" },
    { id: "plan", label: "Plan d'Action" },
  ];

  return (
    <header
      className="bg-white shadow-md border-b"
      style={{ borderBottomColor: "#e0f2f1" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: "#009688" }}
            >
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PHARMA QMS</h1>
              <p className="text-sm text-gray-600">
                Système de Management de la Qualité
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentSection === item.id
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={
                  currentSection === item.id
                    ? { backgroundColor: "#009688", color: "white" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (currentSection !== item.id) {
                    e.currentTarget.style.color = "#009688";
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentSection !== item.id) {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.backgroundColor = "";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="md:hidden">
            <select
              value={currentSection}
              onChange={(e) => onNavigate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#009688" } as React.CSSProperties}
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
