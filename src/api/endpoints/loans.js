// src/api/endpoints/loans.js
import { FAKE_LOANS } from '../mock'; 

export const loansApi = {
  // 1. Master View: Dobavljanje svih kredita
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: FAKE_LOANS });
      }, 500);
    });
  },

  // 2. Detail View: Dobavljanje pojedinačnog kredita
  getById: (id) => {
    return new Promise((resolve) => {
      const loan = FAKE_LOANS.find(l => l.id === id);
      resolve({ data: loan });
    });
  },

  // 3. NOVO: Dobavljanje referentnih kamatnih stopa (za dinamički EKS)
  // U realnom sistemu, ovo bi vuklo podatke sa Narodne banke ili slično
  getInterestRates: () => {
    return new Promise((resolve) => {
      resolve({
        data: {
          belibor: 4.85, // Referentna stopa koja se menja
          fixedMarginCash: 3.5,
          fixedMarginMortgage: 2.1
        }
      });
    });
  },

  // 4. Workflow: Kreiranje LoanRequest entiteta
  createRequest: (data) => {
    return new Promise((resolve) => {
      // Simuliramo kreiranje entiteta u bazi
      console.log("Kreiran LoanRequest entitet u sistemu sa statusom 'U obradi':", data);
      
      setTimeout(() => {
        resolve({ 
          status: 201, 
          data: {
            requestId: Math.floor(Math.random() * 10000),
            initialStatus: "U obradi",
            createdAt: new Date().toISOString()
          }
        });
      }, 1000);
    });
  }
};