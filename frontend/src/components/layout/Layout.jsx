import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { checkHealth } from '../../api/client';
import Sidebar from './Sidebar';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(null); // null = checking

  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      const ok = await checkHealth();
      if (!cancelled) setIsOnline(ok);
    };
    ping();
    const interval = setInterval(ping, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
  const location = useLocation();

  const title = pageTitles[location.pathname] ||
    (location.pathname.startsWith('/employees/') ? 'Employee Details' : '');

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-md border-b border-border-default flex items-center px-4 lg:px-8 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-ink-muted hover:bg-surface-sunken cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold text-ink">{title}</h1>

          <div className="flex-1" />


          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-faint">
            <div
              className={`w-2 h-2 rounded-full ${isOnline === null
                  ? 'bg-yellow-400 animate-pulse'
                  : isOnline
                    ? 'bg-success animate-pulse'
                    : 'bg-red-500'
                }`}
            />
            {isOnline === null ? 'Checking…' : isOnline ? 'System Online' : 'System Offline'}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
