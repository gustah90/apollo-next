'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const isPrivacyPage = pathname === '/privacy'
  const email = 'gustavohsp90@gmail.com'

  const subject = `Contato — SpaceX Launch Portal (${pathname})`

  const body = 'Olá, gostaria de falar sobre...'
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-8" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">SpaceX Launch Portal</h3>
            <p className="text-slate-400 text-sm">© {currentYear} Todos os direitos reservados</p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <ul className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <li>
                {isPrivacyPage ? (
                  <span className="text-slate-400 text-sm cursor-default">Privacidade</span>
                ) : (
                  <Link
                    href="/privacy"
                    scroll={false}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Privacidade
                  </Link>
                )}
              </li>
              <li className="text-slate-400 text-sm">
                <Link
                  href={mailtoHref}
                  className="group block text-center md:text-left text-slate-300 hover:text-white transition-colors"
                  aria-label={`Enviar e-mail de contato para ${email} com assunto "${subject}"`}
                >
                  <span className="underline decoration-slate-600 hover:decoration-slate-300">
                    Contato
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-500 text-sm">
            Dados fornecidos pela API da SpaceX. Este projeto é apenas para fins de estudo.
          </p>
        </div>
      </div>
    </footer>
  )
}
