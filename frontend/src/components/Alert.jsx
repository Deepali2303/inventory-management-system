import './Alert.css';

export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <span>{message}</span>
        {onClose && (
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
