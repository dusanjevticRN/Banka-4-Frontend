import { useState, useRef, useLayoutEffect } from 'react';
import gsap                                  from 'gsap';
import { useFetch }                          from '../../hooks/useFetch';
import { useDebounce }                       from '../../hooks/useDebounce';
import { actuariesApi }                      from '../../api/endpoints/actuaries';
import Navbar                                from '../../components/layout/Navbar';
import Spinner                               from '../../components/ui/Spinner';
import Alert                                 from '../../components/ui/Alert';
import ActuaryTable                          from '../../features/actuaries/ActuaryTable';
import ActuaryFilters                        from '../../features/actuaries/ActuaryFilters';
import LimitModal                            from '../../features/actuaries/LimitModal';
import styles                                from './ActuariesPage.module.css';

export default function ActuariesPage() {
  const pageRef = useRef(null);

  const [filters, setFilters] = useState({
    email:      '',
    first_name: '',
    last_name:  '',
    position:   '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const debouncedEmail     = useDebounce(filters.email, 400);
  const debouncedFirstName = useDebounce(filters.first_name, 400);
  const debouncedLastName  = useDebounce(filters.last_name, 400);
  const debouncedPosition  = useDebounce(filters.position, 400);

  const { data, loading, error, refetch } = useFetch(
    () => {
      const params = { page, page_size: pageSize };
      if (debouncedEmail)     params.email      = debouncedEmail;
      if (debouncedFirstName) params.first_name  = debouncedFirstName;
      if (debouncedLastName)  params.last_name   = debouncedLastName;
      if (debouncedPosition)  params.position    = debouncedPosition;
      return actuariesApi.getAll(params);
    },
    [debouncedEmail, debouncedFirstName, debouncedLastName, debouncedPosition, page]
  );

  const [selectedActuary, setSelectedActuary] = useState(null);
  const [showLimitModal, setShowLimitModal]   = useState(false);
  const [modalLoading, setModalLoading]       = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-anim', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleChangeLimit(actuary) {
    setSelectedActuary(actuary);
    setShowLimitModal(true);
  }

  async function handleConfirmLimit(newLimit) {
    if (!selectedActuary) return;
    setModalLoading(true);
    try {
      await actuariesApi.changeLimit(selectedActuary.id, newLimit);
      setShowLimitModal(false);
      setSelectedActuary(null);
      refetch();
    } catch {
      // API will 404 until BE implements the endpoint
    } finally {
      setModalLoading(false);
    }
  }

  async function handleResetUsedLimit(actuary) {
    if (!window.confirm(`Reset used limit za ${actuary.first_name} ${actuary.last_name}?`)) return;
    try {
      await actuariesApi.resetUsedLimit(actuary.id);
      refetch();
    } catch {
      // API will 404 until BE implements the endpoint
    }
  }

  const totalPages = data?.total_pages ?? 0;

  return (
    <div ref={pageRef} className={styles.stranica}>
      <Navbar />

      <main className={styles.sadrzaj}>
        <div className="page-anim">
          <div className={styles.breadcrumb}>
            <span>Aktuari</span>
          </div>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Aktuari</h1>
              <p className={styles.pageDesc}>Pregled i upravljanje limitima agenata.</p>
            </div>
          </div>
        </div>

        <div className="page-anim">
          <ActuaryFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {loading && <Spinner />}
        {error && <Alert tip="greska" poruka={error.error ?? 'Greška pri učitavanju.'} />}

        {!loading && !error && data && (
          <div className={`page-anim ${styles.tableCard}`}>
            <ActuaryTable
              actuaries={data.data}
              onChangeLimit={handleChangeLimit}
              onResetUsedLimit={handleResetUsedLimit}
            />
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  ← Prethodna
                </button>
                <span className={styles.pageInfo}>
                  Strana {page} od {totalPages}
                </span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  Sledeća →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <LimitModal
        open={showLimitModal}
        onClose={() => { setShowLimitModal(false); setSelectedActuary(null); }}
        onConfirm={handleConfirmLimit}
        actuary={selectedActuary}
        loading={modalLoading}
      />
    </div>
  );
}
