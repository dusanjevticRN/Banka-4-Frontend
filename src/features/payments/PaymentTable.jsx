import styles from './PaymentTable.module.css';

export default function PaymentTable({ transactions, onRowClick }) {
  if (!transactions?.length) {
    return <div className={styles.empty}>Nema transakcija za prikaz.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Datum i vreme</th>
            <th>Primalac / Svrha</th>
            <th style={{ textAlign: 'right' }}>Iznos</th>
            <th style={{ textAlign: 'center' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr 
              key={t.id} 
              className={styles.tableRow} 
              onClick={() => onRowClick(t)} // Prosleđujemo ceo objekat transakcije
            >
              <td>{t.date}</td>
              <td>
                <div className={styles.name}>{t.recipient}</div>
                <div className={styles.type}>
                  {/* Ikona ili oznaka tipa prema zahtevu 1 */}
                  {t.type === 'exchange' ? '🔄 Menjačnica' : '💸 Plaćanje'}
                </div>
              </td>
              <td 
                style={{ textAlign: 'right' }} 
                className={t.amount < 0 ? styles.amountNegative : styles.amountPositive}
              >
                {/* Formatiranje prema tački 4: dve decimale i valuta */}
                {t.amount.toLocaleString('sr-RS', { minimumFractionDigits: 2 })} {t.currency}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`${styles.badge} ${styles['badge' + t.status.replace(/\s/g, '')]}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}