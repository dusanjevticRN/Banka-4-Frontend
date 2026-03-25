import { visitEmployeeLogin, fillLoginForm, submitLogin } from '../../support/authHelpers';

describe('Feature 1 - Autentifikacija korisnika', () => {
    it('Scenario 3: Neuspešno logovanje zbog nepostojećeg korisnika', () => {
        cy.intercept('POST', '**/api/auth/login').as('login');

        visitEmployeeLogin();
        fillLoginForm('nepostoji+e2e@raf.rs', 'NekaSifra123!');
        submitLogin();

        cy.wait('@login').then(({ response }) => {
            expect([401, 403, 404]).to.include(response?.statusCode);
        });

        cy.url().should('include', '/login');

        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
            expect(win.localStorage.getItem('refresh_token')).to.be.null;
        });
    });
});