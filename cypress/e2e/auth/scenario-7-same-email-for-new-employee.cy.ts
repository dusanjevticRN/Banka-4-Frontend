// cypress/e2e/employees/scenario-07-duplicate-email-real.cy.ts
import { visitEmployeeLogin, fillLoginForm, submitLogin } from '../../support/authHelpers';
import { fillInputByLabel, fillDateByLabel, selectByLabel,} from '../../support/formByLable';



describe('Feature: Kreiranje i aktivacija zaposlenog', () => {
    it('Scenario 7: Kreiranje zaposlenog sa već postojećim email-om', () => {
        const email = 'marko.markovic@example.com';

        // 1) Login admin
        cy.intercept('POST', '**/auth/login').as('login');
        visitEmployeeLogin();
        fillLoginForm('admin@raf.rs', 'admin123');
        submitLogin();
        cy.wait('@login').its('response.statusCode').should('eq', 200);

        // 2) Idi na formu
        cy.visit('/employees/new');
        cy.contains('h1', 'Kreiranje novog zaposlenog').should('be.visible');

        // 3) Intercept real request (bitno: bez /api hardcode)
        cy.intercept('POST', '**/employees/register').as('registerEmployee');

        // 4) Popuni obavezna polja (po validate())
        fillInputByLabel('Ime', 'Marko');
        fillInputByLabel('Prezime', 'Markovic');
        fillInputByLabel('Email adresa', email);
        fillDateByLabel('Datum rođenja', '1990-01-01');
        selectByLabel('Pol', 'M');
        fillInputByLabel('ID Pozicije', '1');
        fillInputByLabel('Departman', 'IT');
        fillInputByLabel('Broj telefona', '+381601234567');
        fillInputByLabel('Adresa', 'Knez Mihailova 1, Beograd')

        // username je required
        fillInputByLabel('Username', 'mmarkovic');

        // permissions nisu required u FE validaciji, ali backend možda očekuje bar jednu
        cy.contains('label', 'employee.view')
            .find('input[type="checkbox"]')
            .check({ force: true });

        // 5) Submit
        cy.contains('button[type="submit"]', 'Kreiraj zaposlenog').click();

        // 6) Assert: backend odbija
        cy.wait('@registerEmployee').then(({ response }) => {
            expect(response?.statusCode).to.eq(409);

            const msg =
                response?.body?.message ??
                response?.body?.error ??
                response?.body?.detail;

            // 1) mora neka poruka da postoji (da korisnik vidi feedback)
            expect(msg, 'backend error message').to.be.a('string').and.not.be.empty;

            // 2) UI mora prikazati tu istu poruku
            cy.contains(String(msg), { timeout: 10000 }).should('be.visible');
        });

// 3) ostaje na formi (nema navigate('/employees'))
        cy.url().should('include', '/employees/new');
    });
});