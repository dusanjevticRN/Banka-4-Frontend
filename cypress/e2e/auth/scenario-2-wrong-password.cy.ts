import { visitEmployeeLogin, fillLoginForm, submitLogin } from '../../support/authHelpers';

describe('Feature 1 - Autentifikacija korisnika', () => {
    it('Scenario 2: Neuspešno logovanje zbog pogrešne lozinke', () => {
        cy.intercept('POST', '**/api/auth/login').as('login');

        visitEmployeeLogin();
        fillLoginForm('admin@raf.rs', 'pogresna123');
        submitLogin();

        cy.wait('@login').then(({ response }) => {
            expect([401, 403]).to.include(response?.statusCode);
        });

        cy.url().should('include', '/login');

        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
            expect(win.localStorage.getItem('refresh_token')).to.be.null;
        });
    });
});