describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the home page', () => {
    cy.contains('h1', 'Welcome to Apollo Next').should('be.visible')
  })

  it('should navigate to about page', () => {
    cy.get('a[href="/about"]').click()
    cy.url().should('include', '/about')
  })
})
