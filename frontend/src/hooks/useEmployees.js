import { useState, useEffect, useCallback } from 'react';
import { employeesApi } from '../api/employees';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (employeeData) => {
    const created = await employeesApi.create(employeeData);
    setEmployees((prev) => [created, ...prev]);
    return created;
  };

  const deleteEmployee = async (id) => {
    await employeesApi.delete(id);
    setEmployees((prev) => prev.filter((e) => e.employee_id !== id));
  };

  return { employees, loading, error, addEmployee, deleteEmployee, refetch: fetchEmployees };
}

export function useEmployee(id) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await employeesApi.getOne(id);
      setEmployee(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading, error, refetch: fetchEmployee };
}
