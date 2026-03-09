const styles = {
  Present: 'bg-success-light text-success',
  Absent: 'bg-danger-light text-danger',
  default: 'bg-stone-100 text-ink-muted',
};

export default function Badge({ status, className = '' }) {
  const style = styles[status] || styles.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Present' ? 'bg-success' : status === 'Absent' ? 'bg-danger' : 'bg-ink-faint'}`} />
      {status}
    </span>
  );
}
