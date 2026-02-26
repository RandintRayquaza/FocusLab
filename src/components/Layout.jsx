import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, LayoutDashboard, Timer, CheckSquare, BarChart2, Home, Settings } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Focus Session', path: '/session', icon: <Timer size={20} /> },
    { name: 'Daily Check', path: '/check-in', icon: <CheckSquare size={20} /> }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-primary font-inter">
      {/* Sidebar */}
      <aside className="w-64 glass border-y-0 border-l-0 border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-success flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Activity size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FocusLab</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500 font-semibold border border-primary-500/20'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex items-center space-x-3 text-text-secondary hover:text-text-primary px-4 py-3 w-full rounded-xl transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Visible only on small screens) */}
      <nav className="md:hidden glass fixed bottom-0 left-0 right-0 border-t border-x-0 border-b-0 border-white/5 px-6 py-4 flex justify-between items-center z-50">
         {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 transition-colors ${
                  isActive ? 'text-primary-500' : 'text-text-secondary'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          ))}
      </nav>
    </div>
  );
}
