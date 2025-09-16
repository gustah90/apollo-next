/**
 * @jest-environment jsdom
 */
import React, { cloneElement, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

type PropsWithChildren<P = Record<string, unknown>> = P & { children?: ReactNode }

interface ButtonProps extends PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  asChild?: boolean
}
jest.mock('@/components/ui/button', () => ({
  Button: ({ asChild, children, ...rest }: ButtonProps): ReactElement => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement, { ...rest })
    }
    return <button {...rest}>{children}</button>
  },
}))

jest.mock('@/components/layout/CustomBreadcrumb', () => ({
  __esModule: true,
  CustomBreadcrumb: ({
    items,
  }: {
    items: Array<{ href: string; label: string; isCurrent?: boolean }>
  }) => (
    <nav data-testid="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>{item.label}</span>
      ))}
    </nav>
  ),
}))

type CardShellProps = PropsWithChildren<{ className?: string }>
jest.mock('@/components/ui/card', () => ({
  Card: ({ className, children, ...rest }: CardShellProps): ReactElement => (
    <div data-testid="card" className={className} {...rest}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
  CardTitle: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
  CardDescription: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
  CardContent: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
}))

jest.mock('@/components/layout/Header', () => ({ Header: (): ReactElement | null => null }))
jest.mock('@/components/layout/Footer', () => ({ Footer: (): ReactElement | null => null }))

jest.mock('lucide-react', () => {
  const React = jest.requireActual('react') as typeof import('react')
  type IconProps = React.SVGProps<SVGSVGElement>
  const Icon = (props: IconProps): React.ReactElement =>
    React.createElement('svg', { ...props, 'aria-hidden': 'true' })

  return {
    __esModule: true,
    Rocket: Icon,
    Layout: Icon,
    Search: Icon,
    Monitor: Icon,
    Smartphone: Icon,
    Server: Icon,
    TestTube: Icon,
    Code: Icon,
    GitBranch: Icon,
    Accessibility: Icon,
    ArrowLeft: Icon,
  }
})

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
      scroll,
    }: {
      children: React.ReactNode
      href: string
      scroll?: boolean
    }) => (
      <a href={href} data-test-scroll={String(scroll)}>
        {children}
      </a>
    ),
  }
})

import AboutPage from '@/app/about/page'

describe('AboutPage', () => {
  it('renderiza o título e a descrição principal', async () => {
    const element = await AboutPage()
    render(element)

    expect(screen.getByText(/sobre o projeto/i)).toBeInTheDocument()

    expect(screen.getByText(/Conheça mais sobre o SpaceX Launch Portal/i)).toBeInTheDocument()
  })

  it('exibe as seções principais do conteúdo (h2)', async () => {
    const element = await AboutPage()
    render(element)

    expect(screen.getByRole('heading', { name: /o projeto/i, level: 2 })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /funcionalidades principais/i, level: 2 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /tecnologias utilizadas/i, level: 2 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /estratégias de renderização/i, level: 2 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /recursos de acessibilidade/i, level: 2 }),
    ).toBeInTheDocument()
  })
})
