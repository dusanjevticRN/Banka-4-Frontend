import api from '../client';

export const actuariesApi = {
  getAll:         (params)        => api.get('/employees', { params }),
  changeLimit:    (id, limit)     => api.patch(`/actuaries/${id}/limit`, { limit }),
  resetUsedLimit: (id)            => api.post(`/actuaries/${id}/reset-limit`),
};
