import { useEffect, useState } from 'react';
import Alert from '../../components/ui/Alert';
import styles from './LimitModal.module.css';

export default function LimitModal({ open, onClose, onConfirm, actuary, loading = false }) {
  const [newLimit, setNewLimit] = useState('');
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!open) return;
    setNewLimit(actuary?.limit != null ? String(actuary.limit) : '');
    setError(null);
  }, [open, actuary]);

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = Number(newLimit);
    if (!newLimit || isNaN(parsed) || parsed <= 0) {
      setError('Unesite validan limit (broj veći od 0).');
      return;
    }
    onConfirm(parsed);
  }

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Promeni limit</h3>
            <p className={styles.modalText}>
              Agent: {actuary?.first_name} {actuary?.last_name}
            </p>
          </div>
          <button type="button" className={styles.closeIconButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {error && <Alert tip="greska" poruka={error} />}

          <label className={styles.field}>
            <span>Novi limit (RSD)</span>
            <input
              type="number"
              min="0"
              step="any"
              value={newLimit}
              onChange={e => {
                setNewLimit(e.target.value);
                if (error) setError(null);
              }}
            />
          </label>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>
              Nazad
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Čuvanje...' : 'Sačuvaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
