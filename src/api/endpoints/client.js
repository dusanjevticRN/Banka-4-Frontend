import api from '../client';

export const clientApi = {
  login:        (data)       => api.post('/client/login', data),
  getAccounts:  ()           => api.get('/client/accounts'),
  getTransactions: (accountId) => api.get('/client/transactions', { params: { account_id: accountId } }),
  getRecipients: ()          => api.get('/client/recipients'),
  getRates:     ()           => api.get('/client/rates'),
};