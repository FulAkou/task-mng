import { LogOut, Menu, User, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GT</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Gestionnaire de Tâches
              </span>
            </div>
          </div>

          {/* Menu de navigation desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Bonjour,{" "}
                <span className="font-medium text-gray-900">{user?.name}</span>
              </span>

              {/* Menu utilisateur */}
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                </button>
              </div>

              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
              </button>
            </div>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <div className="px-3 py-2 text-sm text-gray-700">
              Bonjour,{" "}
              <span className="font-medium text-gray-900">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
