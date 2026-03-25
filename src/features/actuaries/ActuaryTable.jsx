import styles from './ActuaryTable.module.css';

function formatLimit(value) {
  if (value == null) return '—';
  return Number(value).toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RSD';
}

export default function ActuaryTable({ actuaries, onChangeLimit, onResetUsedLimit }) {
  if (!actuaries?.length) {
    return <div className={styles.empty}>Nema agenata za prikaz.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Email</th>
            <th>Pozicija</th>
            <th>Limit</th>
            <th>Used Limit</th>
            <th>Need Approval</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {actuaries.map(agent => (
            <tr key={agent.id}>
              <td className={styles.name}>{agent.first_name}</td>
              <td className={styles.name}>{agent.last_name}</td>
              <td className={styles.email}>{agent.email}</td>
              <td>{agent.position_id ?? '—'}</td>
              <td>{formatLimit(agent.limit)}</td>
              <td>{formatLimit(agent.used_limit)}</td>
              <td>
                <span className={`${styles.badge} ${agent.need_approval ? styles.badgeYes : styles.badgeNo}`}>
                  {agent.need_approval ? 'Da' : 'Ne'}
                </span>
              </td>
              <td className={styles.actions}>
                <button
                  className={styles.btnAction}
                  onClick={() => onChangeLimit(agent)}
                >
                  Promeni limit
                </button>
                <button
                  className={`${styles.btnAction} ${styles.btnReset}`}
                  onClick={() => onResetUsedLimit(agent)}
                >
                  Reset
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
