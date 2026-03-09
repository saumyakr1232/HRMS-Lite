import { useState, useEffect } from 'react';
import { Eye, Users } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { attendanceApi } from '../api/attendance';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';

export default function Attendance() {
  const { employees, loading: empLoading } = useEmployees();
  const toast = useToast();

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState('Present');
  const [submitting, setSubmitting] = useState(false);

  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Fetch records when employee selection changes
  useEffect(() => {
    if (!selectedEmployee) {
      setRecords([]);
      return;
    }
    const fetchRecords = async () => {
      setRecordsLoading(true);
      try {
        const data = await attendanceApi.getByEmployee(selectedEmployee);
        setRecords(data);
      } catch {
        setRecords([]);
      } finally {
        setRecordsLoading(false);
      }
    };
    fetchRecords();
  }, [selectedEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    if (date > today) {
      toast.error('Cannot mark attendance for a future date');
      return;
    }
    setSubmitting(true);
    try {
      const created = await attendanceApi.mark({
        employee_id: selectedEmployee,
        date,
        status,
      });
      toast.success(`Attendance marked as ${status} for ${selectedEmployee}`);
      setRecords((prev) => [created, ...prev]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const employeeOptions = employees.map((e) => ({
    value: e.employee_id,
    label: `${e.employee_id} — ${e.full_name}`,
  }));

  const selectedName = employees.find((e) => e.employee_id === selectedEmployee)?.full_name;

  if (empLoading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-xl font-bold text-ink">Mark Attendance</h2>
        <p className="text-sm text-ink-muted mt-0.5">Record daily attendance for employees.</p>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="You need to add employees before you can mark attendance."
          actionLabel="Go to Employees"
          onAction={() => window.location.href = '/employees'}
          icon={<Users className="w-8 h-8 text-brand-400" strokeWidth={1.5} />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-surface-raised border border-border-default rounded-2xl p-6 space-y-5 animate-fade-in sticky top-24">
              <h3 className="text-base font-semibold text-ink">Record Attendance</h3>

              <Select
                label="Employee"
                required
                placeholder="Select employee"
                options={employeeOptions}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              />

              <Input
                label="Date"
                required
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Status <span className="text-danger">*</span></label>
                <div className="flex gap-2">
                  {['Present', 'Absent'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all
                        ${status === s
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

              <Button type="submit" loading={submitting} className="w-full" size="lg">
                Mark Attendance
              </Button>
            </form>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-surface-raised border border-border-default rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="px-5 py-4 border-b border-border-default">
                <h3 className="text-base font-semibold text-ink">
                  {selectedEmployee ? `Records for ${selectedName || selectedEmployee}` : 'Attendance Records'}
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  {selectedEmployee ? `${records.length} record${records.length !== 1 ? 's' : ''} found` : 'Select an employee to view records'}
                </p>
              </div>

              {!selectedEmployee ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-ink-faint" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-ink-muted">Select an employee to view their records</p>
                </div>
              ) : recordsLoading ? (
                <div className="p-8 text-center text-sm text-ink-muted">Loading records...</div>
              ) : records.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No records yet"
                    description="No attendance has been recorded for this employee."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-sunken/50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Date</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Day</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {records.map((rec, idx) => {
                        const d = new Date(rec.date);
                        return (
                          <tr key={rec.id} className="hover:bg-surface-sunken/40 animate-slide-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                            <td className="px-5 py-3.5 text-sm text-ink">
                              {d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-ink-muted">
                              {d.toLocaleDateString('en-US', { weekday: 'long' })}
                            </td>
                            <td className="px-5 py-3.5"><Badge status={rec.status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
