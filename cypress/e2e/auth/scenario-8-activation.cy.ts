/*
describe('Scenario 8: Zaposleni aktivira nalog putem email linka', () => {
    it('klikne na aktivacioni link, unese lozinku 2x i aktivira nalog', () => {
        const token = Cypress.env('ACTIVATION_TOKEN');
        expect(token, 'ACTIVATION_TOKEN').to.be.a('string').and.not.be.empty;

        // Aktivacioni link ide kao query param: /activate?token=...
        cy.visit(`/activate?token=${encodeURIComponent(String(token))}`);

        // Provera da nije "missing token" grana
        cy.contains('Nedostaje aktivacioni token').should('not.exist');
        cy.contains('Aktivirajte nalog').should('be.visible');

        cy.intercept('POST', '**!/auth/activate').as('activate');

        const password = 'NovaLozinka!123'; // mora proći validirajLozinku()

        cy.get('input#password').clear().type(password);
        cy.get('input#confirm').clear().type(password);

        cy.contains('button[type="submit"]', 'Aktiviraj nalog').click();

        cy.wait('@activate').then(({ response }) => {
            cy.log(`status=${response?.statusCode}`);
            cy.log(JSON.stringify(response?.body));
        });
        // UI success state
        cy.contains('Nalog je aktiviran!').should('be.visible');
        cy.contains('Možete se prijaviti sa novom lozinkom.').should('be.visible');
        cy.contains('a', 'Idi na prijavu').should('have.attr', 'href', '/login');
    });
});*/
