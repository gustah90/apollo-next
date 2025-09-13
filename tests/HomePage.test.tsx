import { render, screen } from '@testing-library/react'
import HomePage from '../src/app/page'

describe('HomePage', () => {
  it('renders the heading', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /welcome to apollo next/i })).toBeInTheDocument()
  })

  it('renders a link to the about page', () => {
    render(<HomePage />)
    const link = screen.getByRole('link', { name: /about/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about')
  })
})
