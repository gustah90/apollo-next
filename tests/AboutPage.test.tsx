import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'

describe('AboutPage', () => {
  it('exibe o título da página', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: /about page/i })).toBeInTheDocument()
  })

  it('exibe o parágrafo descritivo', () => {
    render(<AboutPage />)
    expect(screen.getByText(/minimal page for e2e navigation test\./i)).toBeInTheDocument()
  })

  it('possui um link para a página inicial', () => {
    render(<AboutPage />)
    const link = screen.getByRole('link', {
      name: /voltar à página inicial/i,
    })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
