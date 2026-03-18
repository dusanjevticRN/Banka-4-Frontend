import { useRef, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { clientApi } from '../api/endpoints/client';
import { useFetch } from '../hooks/useFetch';
import styles from './ClientSubPage.module.css';

function formatAmount(amount, currency = 'RSD') {
  return new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(amount)) + ' ' + currency;
}

export default function ClientTransfers() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const { data } = useFetch(() => clientApi.getAccounts(), []);
  const accounts = data?.data ?? [];

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sub-card', { opacity: 0, y: 20, duration: 0.45, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit() {
    if (!from || !to || !amount || from === to) return;
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setAmount(''); }, 2500);
  }

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => navigate('/dashboard')}>← Nazad</button>
        <h1 className={styles.title}>Transferi</h1>
      </div>
      <div className={`sub-card ${styles.card} ${styles.formCard}`}>
        <p className={styles.formDesc}>Prenesite sredstva između vaših računa.</p>
        {success && <div className={styles.successBanner}>✓ Transfer je uspešno izvršen!</div>}
        <div className={styles.formField}>
          <label>Sa računa</label>
          <select className={styles.formInput} value={from} onChange={e => setFrom(e.target.value)}>
            <option value="">Izaberite račun...</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} — {formatAmount(a.balance, a.currency)}</option>)}
          </select>
        </div>
        <div className={styles.formField}>
          <label>Na račun</label>
          <select className={styles.formInput} value={to} onChange={e => setTo(e.target.value)}>
            <option value="">Izaberite račun...</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} — {formatAmount(a.balance, a.currency)}</option>)}
          </select>
        </div>
        <div className={styles.formField}>
          <label>Iznos</label>
          <input type="number" placeholder="0.00" className={styles.formInput} value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        {from && to && from === to && <p className={styles.errorMsg}>Izvorni i odredišni račun moraju biti različiti.</p>}
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!from || !to || !amount || from === to}>
          Izvrši transfer
        </button>
      </div>
    </div>
  );
}
