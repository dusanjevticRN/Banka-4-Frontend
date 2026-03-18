import { useRef, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import styles from './ClientSubPage.module.css';

const FAKE_LOANS = [
  { id: 1, type: 'Stambeni kredit', amount: 4500000, remaining: 3120000, rate: '3.5%', nextPayment: '01.04.2026.', installment: 28500 },
  { id: 2, type: 'Potrošački kredit', amount: 300000, remaining: 87000, rate: '6.9%', nextPayment: '15.04.2026.', installment: 9200 },
];

function formatAmount(n) {
  return new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2 }).format(n) + ' RSD';
}

export default function ClientLoans() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sub-card', { opacity: 0, y: 20, duration: 0.45, ease: 'power2.out', stagger: 0.07 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2500);
  }

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => navigate('/dashboard')}>← Nazad</button>
        <h1 className={styles.title}>Krediti</h1>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>+ Novi zahtev</button>
      </div>

      <div className={styles.list}>
        {FAKE_LOANS.map(loan => (
          <div key={loan.id} className={`sub-card ${styles.card}`}>
            <div className={styles.loanHeader}>
              <span className={styles.loanType}>{loan.type}</span>
              <span className={styles.statusBadge + ' ' + styles.statusActive}>Aktivan</span>
            </div>
            <div className={styles.loanBar}>
              <div
                className={styles.loanBarFill}
                style={{ width: `${((loan.amount - loan.remaining) / loan.amount) * 100}%` }}
              />
            </div>
            <div className={styles.loanStats}>
              <div><span className={styles.loanLabel}>Otplaćeno</span><strong>{formatAmount(loan.amount - loan.remaining)}</strong></div>
              <div><span className={styles.loanLabel}>Preostalo</span><strong>{formatAmount(loan.remaining)}</strong></div>
              <div><span className={styles.loanLabel}>Kamata</span><strong>{loan.rate}</strong></div>
              <div><span className={styles.loanLabel}>Sledeća rata</span><strong>{loan.nextPayment}</strong></div>
              <div><span className={styles.loanLabel}>Rata</span><strong>{formatAmount(loan.installment)}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Zahtev za kredit</h3>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            {submitted ? (
              <div className={styles.successBanner} style={{ margin: '2rem' }}>✓ Zahtev je uspešno podnet! Kontaktiraćemo vas u roku od 2 radna dana.</div>
            ) : (
              <div className={styles.formCard} style={{ boxShadow: 'none', border: 'none' }}>
                <div className={styles.formField}><label>Vrsta kredita</label>
                  <select className={styles.formInput}>
                    <option>Stambeni kredit</option><option>Potrošački kredit</option><option>Auto kredit</option>
                  </select>
                </div>
                <div className={styles.formField}><label>Željeni iznos (RSD)</label>
                  <input type="number" placeholder="500000" className={styles.formInput} />
                </div>
                <div className={styles.formField}><label>Rok otplate (meseci)</label>
                  <input type="number" placeholder="60" className={styles.formInput} />
                </div>
                <button className={styles.submitBtn} onClick={handleSubmit}>Podnesi zahtev</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
