import { useNavigate } from 'react-router-dom';
import { Users, Building2, CheckCircle2, XCircle, UserPlus, ClipboardCheck } from 'lucide-react';
import { useDashboard } from '../hooks/useAttendance';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/LoadingSpinner';

const statCards = [
  {
    key: 'total_employees',
    label: 'Total Employees',
    color: 'bg-brand-50 text-brand-700',
    iconBg: 'bg-brand-100',
    icon: <Users className="w-5 h-5 text-brand-600" strokeWidth={1.8} />,
  },
  {
    key: 'total_departments',
    label: 'Departments',
    color: 'bg-violet-50 text-violet-700',
    iconBg: 'bg-violet-100',
    icon: <Building2 className="w-5 h-5 text-violet-600" strokeWidth={1.8} />,
  },
  {
    key: 'present_today',
    label: 'Present Today',
    color: 'bg-emerald-50 text-emerald-700',
    iconBg: 'bg-emerald-100',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2} />,
  },
  {
    key: 'absent_today',
    label: 'Absent Today',
    color: 'bg-rose-50 text-rose-700',
    iconBg: 'bg-rose-100',
    icon: <XCircle className="w-5 h-5 text-rose-600" strokeWidth={2} />,
  },
];

export default function Dashboard() {
  const { dashboard, loading, error } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
        <p className="text-ink-muted mt-1">Here's an overview of your organization today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((card) => (
            <div
              key={card.key}
              className="group relative bg-surface-raised border border-border-default rounded-2xl p-5 hover:shadow-md hover:shadow-black/4 hover:-translate-y-0.5 transition-all duration-300 animate-slide-in-up"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-ink tracking-tight">
                {dashboard?.[card.key] ?? 0}
              </p>
              <p className="text-sm text-ink-muted mt-1">{card.label}</p>
            </div>
          ))}
      </div>

      {error && (
        <div className="p-4 bg-danger-light border border-danger/20 rounded-xl text-sm text-danger animate-fade-in">
          Failed to load dashboard data: {error}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-surface-raised border border-border-default rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="text-base font-semibold text-ink mb-1">Quick Actions</h3>
        <p className="text-sm text-ink-muted mb-5">Common tasks you can perform right away.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/employees')} size="md">
            <UserPlus className="w-4 h-4" />
            Add Employee
          </Button>
          <Button onClick={() => navigate('/attendance')} variant="outline" size="md">
            <ClipboardCheck className="w-4 h-4" />
            Mark Attendance
          </Button>
        </div>
      </div>
    </div>
  );
}
