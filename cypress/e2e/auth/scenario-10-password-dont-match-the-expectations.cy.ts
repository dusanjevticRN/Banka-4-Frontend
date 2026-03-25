// cypress/e2e/auth/scenario-10-weak-password.cy.ts
describe('Scenario 10: Postavljanje lozinke koja ne ispunjava bezbednosne zahteve', () => {
    it('odbija slabu lozinku, prikazuje pravila i ne šalje activate request', () => {
        cy.visit('/activate?token=dummy-token');

        cy.contains('Aktivirajte nalog').should('be.visible');

        // Pravila kompleksnosti su prikazana korisniku
        cy.contains('Min. 8 karaktera').should('be.visible');
        cy.contains('Max. 32 karaktera').should('be.visible');
        cy.contains('≥ 2 broja').should('be.visible');
        cy.contains('1 veliko slovo').should('be.visible');
        cy.contains('1 malo slovo').should('be.visible');

        cy.intercept('POST', '**/auth/activate').as('activate');

        // Slaba lozinka (sigurno pada na validirajLozinku)
        cy.get('#password').clear().type('abc');
        cy.get('#confirm').clear().type('abc');
        cy.contains('button[type="submit"]', 'Aktiviraj nalog').click();

        // Front-end validacija treba da spreči slanje request-a
        cy.get('@activate.all').should('have.length', 0);

        // Ne sme preći u success state
        cy.contains('Nalog je aktiviran!').should('not.exist');

        // I dalje je na aktivacionoj formi
        cy.url().should('include', '/activate');
    });
});