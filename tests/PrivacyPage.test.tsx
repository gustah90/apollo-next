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
    ArrowLeft: Icon,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LinkProps extends PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>> {
  href: string
}
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

import PrivacyPage from '@/app/privacy/page'

describe('PrivacyPage (unit)', () => {
  it('renderiza o H1 e a data de última atualização', async () => {
    const element = await PrivacyPage()
    render(element)

    expect(
      screen.getByRole('heading', { name: /política de privacidade/i, level: 1 }),
    ).toBeInTheDocument()

    expect(screen.getByText(/última atualização:/i)).toBeInTheDocument()
  })

  it('exibe o bloco de Licença MIT com autor', async () => {
    const element = await PrivacyPage()
    render(element)

    // CardTitle mockado é <div>, então verificamos por texto
    expect(screen.getByText(/licença mit/i)).toBeInTheDocument()
    expect(screen.getByText(/copyright \(c\) 2025/i)).toBeInTheDocument()
    expect(screen.getByText(/gustah90/i)).toBeInTheDocument()
  })

  it('exibe as seções principais (h2): Coleta de Dados e Dados Técnicos', async () => {
    const element = await PrivacyPage()
    render(element)

    expect(screen.getByRole('heading', { name: /coleta de dados/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /dados técnicos/i, level: 2 })).toBeInTheDocument()
  })
})
