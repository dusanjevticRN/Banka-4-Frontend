// // cypress/e2e/employees/scenario-11-employee-list.cy.ts
// import { visitEmployeeLogin, fillLoginForm, submitLogin } from '../../support/authHelpers';
//
// describe('Scenario 11: Admin vidi listu svih zaposlenih', () => {
//     it('prikazuje listu na /employees i otvara detalje /employees/:id', () => {
//         cy.intercept('POST', '**/auth/login').as('login');
//         cy.intercept('GET', '**/employees*').as('getEmployees');
//
//         visitEmployeeLogin();
//         fillLoginForm('admin@raf.rs', 'admin123');
//         submitLogin();
//
//         cy.wait('@login').its('response.statusCode').should('eq', 200);
//
//         cy.visit('/employees');
//         cy.location(/**/'pathname').should('eq', '/employees');
//
//         cy.wait('@getEmployees', { timeout: 20000 }).then(({ response }) => {
//             expect([200, 304], `GET /employees status=${response?.statusCode}`).to.include(response?.statusCode);
//         });
//
//         // Lista treba da ima bar jedan link ka /employees/<id>
//         cy.get('a[href^="/employees/"]', { timeout: 20000 }).should('have.length.greaterThan', 0);
//
//         // Klik na prvog zaposlenog
//         cy.get('a[href^="/employees/"]').first().click();
//
//         // Očekujemo rutu /employees/:id
//         cy.location('pathname', { timeout: 20000 }).should('match', /^\/employees\/\d+$/);
//     });
// });