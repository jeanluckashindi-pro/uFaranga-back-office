import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle';

function Layout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Utilisateurs' },
    { path: '/admin/transactions', icon: '💳', label: 'Transactions' },
    { path: '/admin/agents', icon: '🏪', label: 'Agents' },
    { path: '/admin/reports', icon: '📈', label: 'Rapports' },
    { path: '/admin/settings', icon: '⚙️', label: 'Paramètres' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-card border-b border-default sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-2xl hover:bg-background p-2 rounded transition-colors"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold text-primary font-roboto">
              uFaranga Admin
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-background rounded transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-4 border-l border-default">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-card border-r border-default transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-background text-foreground'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
