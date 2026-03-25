import { visitEmployeeLogin } from '../../support/authHelpers';

describe('Feature 1 - Autentifikacija korisnika', () => {
    it('Scenario 4: Zaboravljena lozinka - slanje zahteva', () => {
        cy.intercept('POST', '**/api/auth/forgot-password').as('forgot');

        visitEmployeeLogin();

        // Klik na "Zaboravljena lozinka" (prilagodi ako je drugačiji tekst)
        cy.contains(/zaborav|forgot/i).click();

        // Email polje (prilagodi selektor ako nije ovo)
        cy.get('input[type="email"], #email').clear().type('admin@raf.rs');

        // Submit dugme (prilagodi tekst ako je drugačiji)
        cy.contains('button', /pošalji|send/i).click();

        cy.wait('@forgot').then(({ response }) => {
            expect([200, 204]).to.include(response?.statusCode);
        });

        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
            expect(win.localStorage.getItem('refresh_token')).to.be.null;
        });
    });
});