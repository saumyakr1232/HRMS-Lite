import { useState, useEffect, useCallback } from 'react';
import { attendanceApi } from '../api/attendance';

export function useAttendance(employeeId) {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(
    async (dateFilter) => {
      if (!employeeId) return;
      setLoading(true);
      setError(null);
      try {
        const [recordsData, summaryData] = await Promise.all([
          attendanceApi.getByEmployee(employeeId, dateFilter),
          attendanceApi.getSummary(employeeId),
        ]);
        setRecords(recordsData);
        setSummary(summaryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const markAttendance = async (data) => {
    const created = await attendanceApi.mark(data);
    setRecords((prev) => [created, ...prev]);
    if (employeeId) {
      const summaryData = await attendanceApi.getSummary(employeeId);
      setSummary(summaryData);
    }
    return created;
  };

  return { records, summary, loading, error, markAttendance, refetch: fetchRecords };
}

export function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
}
