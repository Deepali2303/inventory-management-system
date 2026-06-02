import { useEffect } from 'react';
import './Alert.css';

export default function Alert({ type = 'success', message, onClose }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`alert-toast alert-${type}`} role="alert">
      {type === 'success' ? '✅ ' : '⚠️ '}
      <span>{message}</span>
    </div>
  );
}
