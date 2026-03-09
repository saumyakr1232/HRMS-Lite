import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Users } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';

const DEPARTMENTS = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'Design'];

const initialForm = { employee_id: '', full_name: '', email: '', department: '' };

export default function Employees() {
  const { employees, loading, error, addEmployee, deleteEmployee } = useEmployees();
  const toast = useToast();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.employee_id.trim()) errors.employee_id = 'Employee ID is required';
    else if (!/^[A-Za-z0-9_-]+$/.test(form.employee_id)) errors.employee_id = 'Only alphanumeric, dash, underscore';
    if (!form.full_name.trim()) errors.full_name = 'Full name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.department) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addEmployee(form);
      toast.success(`Employee ${form.employee_id} added successfully`);
      setForm(initialForm);
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.employee_id);
      toast.success(`Employee ${deleteTarget.employee_id} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-ink">Employee Directory</h2>
          <p className="text-sm text-ink-muted mt-0.5">{employees.length} employee{employees.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-danger-light border border-danger/20 rounded-xl text-sm text-danger animate-fade-in">
          {error}
        </div>
      )}

      {employees.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Add your first employee to get started with the HRMS system."
          actionLabel="Add Employee"
          onAction={() => setShowAddModal(true)}
          icon={<Users className="w-8 h-8 text-brand-400" strokeWidth={1.5} />}
        />
      ) : (
        <div className="bg-surface-raised border border-border-default rounded-2xl overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-sunken/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Employee ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Full Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wider hidden md:table-cell">Department</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {employees.map((emp, idx) => (
                  <tr
                    key={emp.employee_id}
                    className="hover:bg-surface-sunken/40 group animate-slide-in-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                        {emp.employee_id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/employees/${emp.employee_id}`)}
                        className="text-sm font-medium text-ink hover:text-brand-700 cursor-pointer bg-transparent border-none p-0"
                      >
                        {emp.full_name}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-muted hidden sm:table-cell">{emp.email}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs font-medium text-ink-muted bg-stone-100 px-2.5 py-1 rounded-full">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/employees/${emp.employee_id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger! hover:bg-danger-light!"
                          onClick={() => setDeleteTarget(emp)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setForm(initialForm); setFormErrors({}); }} title="Add New Employee" maxWidth="max-w-lg">
        <form onSubmit={handleAdd} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Employee ID"
              required
              placeholder="e.g. EMP001"
              value={form.employee_id}
              onChange={(e) => updateField('employee_id', e.target.value)}
              error={formErrors.employee_id}
            />
            <Input
              label="Full Name"
              required
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              error={formErrors.full_name}
            />
          </div>
          <Input
            label="Email Address"
            required
            type="email"
            placeholder="john.doe@company.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={formErrors.email}
          />
          <Select
            label="Department"
            required
            placeholder="Select department"
            options={DEPARTMENTS}
            value={form.department}
            onChange={(e) => updateField('department', e.target.value)}
            error={formErrors.department}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setForm(initialForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Add Employee
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Employee">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center mb-4 mx-auto">
            <Trash2 className="w-6 h-6 text-danger" />
          </div>
          <p className="text-sm text-ink text-center mb-1">
            Are you sure you want to delete <strong>{deleteTarget?.full_name}</strong>?
          </p>
          <p className="text-xs text-ink-muted text-center mb-6">
            This will also remove all their attendance records. This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
