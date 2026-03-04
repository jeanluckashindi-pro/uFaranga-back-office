import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Wallet, FileText, Bell,
  Settings, LogOut, ChevronLeft, ChevronRight, Menu, X,
  TrendingUp, DollarSign, Globe
} from 'lucide-react';

function AgentLayout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Menu simplifié pour agent
  const menuItems = [
    {
      section: 'Principal',
      items: [
        { path: '/agent', icon: LayoutDashboard, label: 'Tableau de bord', badge: null },
        { path: '/agent/transactions', icon: Activity, label: 'Transactions', badge: null },
        { path: '/agent/soldes', icon: Wallet, label: 'Soldes', badge: null },
      ]
    },
    {
      section: 'Gestion',
      items: [
        { path: '/agent/rapports', icon: FileText, label: 'Rapports', badge: null },
        { path: '/agent/commissions', icon: TrendingUp, label: 'Commissions', badge: null },
      ]
    },
    {
      section: 'Compte',
      items: [
        { path: '/agent/notifications', icon: Bell, label: 'Notifications', badge: notifications },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/agent') {
      return location.pathname === '/agent';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:block fixed left-0 h-full bg-background border-r border-text/10 transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="mt-6 px-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-xl font-anton uppercase text-text">uFaranga</h1>
          ) : (
            <div className="w-full flex justify-center">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                U
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="px-4 mt-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full p-2 bg-background border border-darkGray rounded-lg text-text hover:bg-card transition-colors flex items-center justify-center"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-10 px-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {isSidebarOpen && (
                <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-3">
                  {section.section}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-card text-gray-300 hover:text-text'
                    }`}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {isSidebarOpen && <span>{item.label}</span>}
                    </div>
                    {isSidebarOpen && item.badge && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive(item.path)
                          ? 'bg-white text-primary'
                          : 'bg-danger text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className={`mt-8 pt-6 border-t border-text/10 ${!isSidebarOpen && 'px-0'}`}>
            <button className={`flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-3 rounded-lg w-full hover:bg-danger/10 text-danger transition-all`}>
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>

          {/* Support Info */}
          {isSidebarOpen && (
            <div className="mt-6 p-4 bg-card border border-darkGray rounded-lg">
              <div className="text-xs text-gray-400 mb-2">Support 24/7</div>
              <div className="text-sm font-semibold text-text">+257 79 123 456</div>
            </div>
          )}
        </nav>
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
        className={`md:hidden fixed left-0 h-full w-64 bg-background border-r border-text/10 z-50 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="mt-6 px-4 flex items-center justify-between">
          <h1 className="text-xl font-anton uppercase text-text">uFaranga</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        {/* Navigation Mobile */}
        <nav className="mt-10 px-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-3">
                {section.section}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-card text-gray-300 hover:text-text'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive(item.path)
                          ? 'bg-white text-primary'
                          : 'bg-danger text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
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

              {/* Welcome Message */}
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
              {/* Quick Stats - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-6 px-6 border-l border-r border-text/10">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Float</div>
                  <div className="text-sm font-bold text-secondary">2.5M BIF</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Cash</div>
                  <div className="text-sm font-bold text-primary">1.8M BIF</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Commissions</div>
                  <div className="text-sm font-bold text-text">45K BIF</div>
                </div>
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

              {/* Language Selector */}
              <button className="p-2 hover:bg-card rounded-lg transition-colors">
                <Globe className="w-5 h-5 text-secondary" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-4 border-l border-text/10">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-2 border-text/25 flex items-center justify-center text-white font-bold">
                  JM
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-text">Jean Mukiza</div>
                  <div className="text-xs text-gray-400">Agent #A12345</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AgentLayout;
