import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, User } from 'lucide-react';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.8} />,
  },
  {
    to: '/employees',
    label: 'Employees',
    icon: <Users className="w-5 h-5" strokeWidth={1.8} />,
  },
  {
    to: '/attendance',
    label: 'Attendance',
    icon: <ClipboardCheck className="w-5 h-5" strokeWidth={1.8} />,
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-65 bg-brand-950 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
            <User className="w-5 h-5 text-brand-950" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">HRMS Lite</h1>
            <p className="text-[10px] text-brand-400 font-medium tracking-widest uppercase">Management</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-brand-800/60 text-white shadow-sm shadow-black/10'
                  : 'text-brand-300 hover:bg-brand-900/60 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-brand-900">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-xs font-bold text-brand-300">
              A
            </div>
            <div>
              <p className="text-xs font-medium text-brand-200">Admin User</p>
              <p className="text-[10px] text-brand-500">admin@hrms.local</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
