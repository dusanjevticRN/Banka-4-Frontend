import './commands';

// Cypress.Commands.add('loginAsAdmin', () => {
//     cy.session('admin', () => {
//         cy.visit('/login');
//         cy.get('input[type="email"]').type('admin@raf.rs');
//         cy.get('input[type="password"]').type('admin123');
//         cy.contains('button', /prijavi|login/i).click();
//         cy.url().should('include', '/admin'); // ili šta god je vaš landing
//     }, {
//         validate() {
//             // minimalna validacija da je token tu
//             cy.window().then((w) => {
//                 expect(w.localStorage.getItem('token')).to.be.a('string');
//             });
//         }
//     });
// });