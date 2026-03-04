import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Menu, X, Bell, LogOut, Search, Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../hooks/useUser';
import MultipleSessionsAlert from './MultipleSessionsAlert';
import UserMenu from './UserMenu';
import allModulesNavigation from '../config/allModulesNavigation';

function AllModulesLayout({ children, userName = 'Super Admin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { 
    user, 
    getFullName, 
    getUserType, 
    getUserTypeLabel,
    getAccessibleModules,
    isSuperAdmin,
    isSystem 
  } = useUser();
  
  // Utiliser les vraies données de l'utilisateur si disponibles
  const displayName = user ? getFullName() : userName;
  const userType = getUserType();
  const accessibleModules = getAccessibleModules();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getBadgeCount = (badgeKey) => {
    if (badgeKey === 'notifications') return notifications;
    return 0;
  };

  // Filtrer les modules et items selon les droits d'accès
  const filteredNavigation = allModulesNavigation
    .filter(section => {
      // Filtre par droits d'accès de l'utilisateur
      if (!accessibleModules.includes(section.module)) {
        return false;
      }
      
      // Filtre par module sélectionné
      if (selectedModule !== 'all' && section.module !== selectedModule) {
        return false;
      }
      return true;
    })
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        // Filtre par recherche
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          item.label.toLowerCase().includes(search) ||
          (item.description && item.description.toLowerCase().includes(search))
        );
      })
    }))
    .filter(section => section.items.length > 0); // Enlever les sections vides

  // Options de modules filtrées selon les droits d'accès
  const allModuleOptions = [
    { value: 'all', label: 'Tous les modules', color: 'primary', module: null },
    { value: 'agent', label: 'Agent', color: 'primary', module: 'agent' },
    { value: 'admin_system', label: 'Admin Système', color: 'danger', module: 'admin_system' },
    { value: 'admin_tech', label: 'Admin Technique', color: 'primary', module: 'admin_tech' },
    { value: 'client', label: 'Client', color: 'primary', module: 'client' }
  ];
  
  const moduleOptions = allModuleOptions.filter(option => {
    // Toujours afficher "Tous les modules"
    if (option.value === 'all') return true;
    // Filtrer selon les modules accessibles
    return accessibleModules.includes(option.module);
  });

  // Déterminer le module actif
  const getCurrentModule = () => {
    if (location.pathname.startsWith('/agent')) return 'agent';
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/tech')) return 'tech';
    return 'agent';
  };

  const currentModule = getCurrentModule();

  const moduleColors = {
    agent: 'primary',
    admin: 'danger',
    tech: 'primary'
  };

  const moduleStats = {
    agent: [
      { label: 'Float', value: '2.5M BIF', color: 'text-secondary' },
      { label: 'Cash', value: '1.8M BIF', color: 'text-primary' },
      { label: 'Commissions', value: '45K BIF', color: 'text-text' }
    ],
    admin: [
      { label: 'Agents', value: '1,234', color: 'text-secondary' },
      { label: 'Clients', value: '45.6K', color: 'text-primary' },
      { label: 'Volume', value: '2.3B BIF', color: 'text-text' }
    ],
    tech: [
      { label: 'Uptime', value: '99.9%', color: 'text-secondary' },
      { label: 'API', value: 'OK', color: 'text-primary' },
      { label: 'Latence', value: '45ms', color: 'text-text' }
    ]
  };

  const currentColor = moduleColors[currentModule];
  const currentStats = moduleStats[currentModule];

  return (
    <>
      {/* Alerte de sessions multiples */}
      <MultipleSessionsAlert />
      
      <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:block fixed left-0 h-screen bg-background border-r border-text/10 transition-all duration-300 z-50 flex flex-col ${
          isSidebarOpen ? 'w-80' : 'w-20'
        }`}
      >
        {/* Top Nav - Hauteur fixe */}
        <div className="h-[160px] flex-shrink-0">
          {/* Logo */}
          <div className="mt-2 px-4 flex items-center justify-between">
            {isSidebarOpen ? (
              <div>
                <h1 className="text-3xl  text-text text-secondary" style={{ fontFamily: 'Kaushan Script, cursive' }}>uFaranga</h1>
                <div className='flex items-center justify-start gap-2 font-allan'><span className="text-x text-white ">Simply</span> <span className="text-x text-primary">Money</span></div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-secondary to-danger flex items-center justify-center text-white font-bold">
                  U
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button et Filtre - Flex Layout */}
          <div className="px-4 mt-4">
            <div className="flex items-center gap-2">
              {/* Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-background border border-darkGray rounded-lg text-text hover:bg-card transition-colors flex items-center justify-center flex-shrink-0"
              >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              {/* Filtre par module - Dropdown */}
              {isSidebarOpen && (
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 bg-card border border-darkGray rounded-lg text-text text-sm focus:outline-none focus:border-darkGray transition-colors appearance-none cursor-pointer"
                  >
                    {moduleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* Recherche */}
          {isSidebarOpen && (
            <div className="px-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-darkGray rounded-lg text-text text-sm placeholder-gray-500 focus:outline-none focus:border-darkGray transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Prend le reste de l'espace */}
        <div className="overflow-y-auto px-4 py-4" style={{ height: 'calc(100vh - 160px)' }}>
          {filteredNavigation.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Aucun résultat trouvé
            </div>
          ) : (
            <>
              {filteredNavigation.map((section, idx) => (
                <div key={idx} className="mb-4">
                  {isSidebarOpen && (
                    <div className="font-antonio  mb-3 px-3 py-1 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-${section.color} flex-shrink-0`}></span>
                      <span className="text-text text-xl">{section.section}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const badgeCount = item.badge ? getBadgeCount(item.badge) : 0;
                      const itemActive = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            itemActive
                              ? `bg-${section.color} text-white font-semibold shadow-lg`
                              : 'hover:bg-card text-gray-300 hover:text-text'
                          }`}
                          title={!isSidebarOpen ? item.label : item.description}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {isSidebarOpen && (
                              <span className="text-sm truncate">{item.label}</span>
                            )}
                          </div>
                          {isSidebarOpen && badgeCount > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                              itemActive
                                ? 'bg-white text-primary'
                                : 'bg-danger text-white'
                            }`}>
                              {badgeCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed left-0 h-full w-80 bg-background border-r border-text/10 z-50 transition-transform duration-300 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Mobile */}
        <div className="mt-6 px-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-anton uppercase text-text">uFaranga Platform</h1>
            <p className="text-xs text-gray-400 mt-1">Tous les Modules</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        {/* Navigation Mobile */}
        <nav className="mt-10 px-4">
          {allModulesNavigation.map((section, idx) => (
            <div key={idx} className="mb-6">
              <div className="text-xs font-bold text-text uppercase mb-3 px-3 py-2 bg-card rounded-lg border border-darkGray">
                {section.section}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const badgeCount = item.badge ? getBadgeCount(item.badge) : 0;
                  const itemActive = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        itemActive
                          ? `bg-${section.color} text-white font-semibold`
                          : 'hover:bg-card text-gray-300 hover:text-text'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {badgeCount > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          itemActive
                            ? 'bg-white text-primary'
                            : 'bg-danger text-white'
                        }`}>
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 w-full max-w-full overflow-hidden ${isSidebarOpen ? 'md:ml-80' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-text/10 px-6 py-3 md:px-10 md:py-4">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu + Welcome */}
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 bg-darkBlue border border-darkGray rounded-lg text-text hover:bg-card transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Welcome Message & System Info */}
              <div className="hidden md:block">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400 font-sans">
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400 font-sans">
                    {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400 font-sans">
                    USD/CDF: 2,850
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400 font-sans">
                    EUR/CDF: 3,120
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats + Actions */}
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-6 px-6 border-l border-r border-text/10">
                {currentStats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-gray-400">{stat.label}</div>
                    <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-card rounded-lg transition-colors">
                <Bell className="w-5 h-5" style={{ color: '#F59648' }} />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-danger rounded-full flex items-center justify-center text-xs text-white">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background w-full">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

export default AllModulesLayout;
