describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('exibe título, subtítulo e main acessível', () => {
    cy.contains('h1', /spacex launch portal/i).should('be.visible')

    cy.contains(/Explore todos os lançamentos da SpaceX com informações detalhadas/i).should(
      'be.visible',
    )

    cy.get('main#conteudo-principal[role="main"]').should('exist')
  })

  it('exibe os cards de estatísticas com ARIA labels', () => {
    cy.get('div[aria-label^="Total de lançamentos:"]').should('exist')

    cy.get('div[aria-label^="Lançamentos bem-sucedidos:"]').should('exist')

    cy.get('div[aria-label^="Lançamentos com vídeo:"]').should('exist')

    cy.get('div[aria-label="Última atualização dos dados"]').should('exist')
  })

  it('exibe a seção de últimos lançamentos', () => {
    cy.contains('h2', /últimos lançamentos/i).should('be.visible')
    cy.get('[role="list"][aria-label="Lista de lançamentos recentes"]').should('exist')
  })

  it('tem CTA para explorar o catálogo com href correto', () => {
    cy.get('a[aria-label="Explorar catálogo completo de lançamentos"]')
      .should('be.visible')
      .and('have.attr', 'href', '/launches')
  })

  it('exibe as instruções de navegação por teclado (nota)', () => {
    cy.get('[role="note"]').should('exist').and('have.class', 'sr-only')
    cy.get('[role="note"]').within(() => {
      cy.contains('Use a tecla Tab para navegar entre os elementos interativos.').should('exist')
      cy.contains(
        'Use as teclas de seta para navegar entre os cards de lançamento quando estiverem em foco.',
      ).should('exist')
    })
  })
})
