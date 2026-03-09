import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Hash, Mail, Building2, Plus } from 'lucide-react';
import { useEmployee } from '../hooks/useEmployees';
import { useAttendance } from '../hooks/useAttendance';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { employee, loading: empLoading, error: empError } = useEmployee(id);
  const { records, summary, loading: attLoading, markAttendance, refetch } = useAttendance(id);

  const [showMarkModal, setShowMarkModal] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [markDate, setMarkDate] = useState(today);
  const [markStatus, setMarkStatus] = useState('Present');
  const [submitting, setSubmitting] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const handleMark = async (e) => {
    e.preventDefault();
    if (markDate > today) {
      toast.error('Cannot mark attendance for a future date');
      return;
    }
    setSubmitting(true);
    try {
      await markAttendance({ employee_id: id, date: markDate, status: markStatus });
      toast.success(`Attendance marked as ${markStatus} for ${markDate}`);
      setShowMarkModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (val) => {
    setDateFilter(val);
    refetch(val || undefined);
  };

  if (empLoading) return <PageLoader />;
  if (empError) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="p-6 bg-danger-light border border-danger/20 rounded-2xl text-center">
          <p className="text-sm text-danger font-medium">{empError}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  const totalDays = (summary?.total_present || 0) + (summary?.total_absent || 0);
  const percentage = totalDays > 0 ? Math.round(((summary?.total_present || 0) / totalDays) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back nav */}
      <button
        onClick={() => navigate('/employees')}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink cursor-pointer bg-transparent border-none p-0 animate-fade-in"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Employees
      </button>

      <div className="bg-surface-raised border border-border-default rounded-2xl p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-brand-700">
              {employee?.full_name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-ink">{employee?.full_name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-ink-faint" strokeWidth={1.5} />
                <span className="font-mono text-brand-700">{employee?.employee_id}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-ink-faint" strokeWidth={1.5} />
                {employee?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-ink-faint" strokeWidth={1.5} />
                {employee?.department}
              </span>
            </div>
          </div>
          <Button onClick={() => setShowMarkModal(true)} size="md">
            <Plus className="w-4 h-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <div className="bg-surface-raised border border-border-default rounded-2xl p-5 animate-slide-in-up">
          <p className="text-sm text-ink-muted mb-1">Present Days</p>
          <p className="text-2xl font-bold text-success">{summary?.total_present || 0}</p>
        </div>
        <div className="bg-surface-raised border border-border-default rounded-2xl p-5 animate-slide-in-up">
          <p className="text-sm text-ink-muted mb-1">Absent Days</p>
          <p className="text-2xl font-bold text-danger">{summary?.total_absent || 0}</p>
        </div>
        <div className="bg-surface-raised border border-border-default rounded-2xl p-5 animate-slide-in-up">
          <p className="text-sm text-ink-muted mb-1">Attendance Rate</p>
          <p className="text-2xl font-bold text-ink">{percentage}%</p>
          <div className="mt-2 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-raised border border-border-default rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '150ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-border-default gap-3">
          <h3 className="text-base font-semibold text-ink">Attendance Records</h3>
          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="flex-row! items-center! gap-2! sm:w-auto"
          />
        </div>

        {attLoading ? (
          <div className="p-8 text-center text-sm text-ink-muted">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No attendance records"
              description={dateFilter ? 'No records found for the selected date.' : 'No attendance has been marked for this employee yet.'}
              actionLabel="Mark Attendance"
              onAction={() => setShowMarkModal(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-sunken/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {records.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-surface-sunken/40 animate-slide-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-5 py-3.5 text-sm text-ink">
                      {new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5"><Badge status={rec.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showMarkModal} onClose={() => setShowMarkModal(false)} title="Mark Attendance">
        <form onSubmit={handleMark} className="p-6 space-y-5">
          <Input
            label="Date"
            required
            type="date"
            value={markDate}
            max={today}
            onChange={(e) => setMarkDate(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Status <span className="text-danger">*</span></label>
            <div className="flex gap-2">
              {['Present', 'Absent'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMarkStatus(s)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all
                    ${markStatus === s
                      ? s === 'Present'
                        ? 'border-success bg-success-light text-success'
                        : 'border-danger bg-danger-light text-danger'
                      : 'border-border-default text-ink-muted hover:border-border-strong bg-transparent'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowMarkModal(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Mark Attendance</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
