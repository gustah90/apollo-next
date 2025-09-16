import Link from 'next/link'
import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  Rocket,
  Layout,
  Search,
  Monitor,
  Smartphone,
  Server,
  TestTube,
  Code,
  GitBranch,
  Accessibility,
  ArrowLeft,
} from 'lucide-react'
import { CustomBreadcrumb } from '@/components/layout/CustomBreadcrumb'

export const metadata: Metadata = {
  title: 'Sobre o Projeto - SpaceX Launch Portal',
  description:
    'Conheça mais sobre o projeto SpaceX Launch Portal, desenvolvido como teste técnico para frontend developer',
}

export default function AboutPage() {
  return (
    <>
      <Header />

      <main
        id="conteudo-principal"
        className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12"
        role="main"
        tabIndex={-1}
      >
        <CustomBreadcrumb
          items={[
            { href: '/', label: 'Início' },
            { href: '#', label: 'Sobre' },
          ]}
          className="mx-auto max-w-4xl px-4 space-y-8"
        />
        <div className="mx-auto max-w-4xl px-4">
          <Card className="border-slate-700/50 bg-slate-800/50 ring-1 ring-white/10 backdrop-blur text-slate-300 pt-4">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Sobre o Projeto</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Conheça mais sobre o SpaceX Launch Portal e suas tecnologias
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-100">O Projeto</h2>
                <p className="text-slate-300 leading-relaxed">
                  O <strong className="text-blue-400">SpaceX Launch Portal</strong> é uma aplicação
                  web moderna que exibe informações sobre os lançamentos espaciais da SpaceX,
                  consumindo dados diretamente da API pública oficial através de GraphQL.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  A aplicação foi construída com foco em boas práticas de desenvolvimento,
                  acessibilidade, responsividade e performance, utilizando as mais modernas
                  tecnologias do ecossistema React e Next.js.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-100">
                  Funcionalidades Principais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-slate-600 bg-slate-700/50  pt-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Rocket className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-lg text-slate-100">Página Inicial</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">
                        Apresentação básica do portal com navegação intuitiva para as demais seções.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/50  pt-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-lg text-slate-100">
                          Catálogo de Lançamentos
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">
                        Listagem completa dos lançamentos com infinite scroll e informações
                        detalhadas.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/50 pt-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Layout className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-lg text-slate-100">Página de Detalhes</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">
                        Visualização completa de cada missão com todos os dados técnicos e
                        multimídia.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/50 pt-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-blue-400" />
                        <Smartphone className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-lg text-slate-100">Design Responsivo</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">
                        Interface adaptada para todos os dispositivos, desde mobile até desktop.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-100">Tecnologias Utilizadas</h2>

                <div className="space-y-4">
                  <Card className="border-slate-600 bg-slate-700/50 pt-4">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Code className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-xl text-blue-400">Frontend</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>
                          <strong>Next.js 15</strong> com App Router para roteamento e renderização
                        </li>
                        <li>
                          <strong>React 18</strong> com hooks e componentes funcionais
                        </li>
                        <li>
                          <strong>TypeScript</strong> para tipagem estática e maior confiabilidade
                        </li>
                        <li>
                          <strong>Tailwind CSS v4</strong> para estilização utilitária e moderna
                        </li>
                        <li>
                          <strong>shadcn/ui</strong> para componentes acessíveis e elegantes
                        </li>
                        <li>
                          <strong>Apollo Client</strong> para integração com GraphQL
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/50 pt-4">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-xl text-blue-400">Backend & API</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>
                          <strong>API GraphQL da SpaceX</strong> como fonte de dados principal
                        </li>
                        <li>Consulta eficiente com Apollo Studio para melhor performance</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/50 pt-4">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <TestTube className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-xl text-blue-400">Testes & Qualidade</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>
                          <strong>Jest</strong> para testes unitários dos componentes
                        </li>
                        <li>
                          <strong>Cypress</strong> para testes end-to-end (E2E)
                        </li>
                        <li>
                          <strong>ESLint</strong> e <strong>Prettier</strong> para padronização de
                          código
                        </li>
                        <li>
                          <strong>Type Checking</strong> nativo do TypeScript
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/50 pt-4">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-xl text-blue-400">DevOps & Deploy</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>
                          <strong>GitHub Actions</strong> para CI/CD automatizado
                        </li>
                        <li>
                          <strong>Vercel</strong> para deploy e hospedagem
                        </li>
                        <li>Pipeline com testes, lint, build e deploy automatizados</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-100">
                  Estratégias de Renderização
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  O projeto implementa duas estratégias diferentes de renderização para otimizar
                  performance e experiência do usuário:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-500/30 bg-green-500/10 pt-4">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-400">
                        SSR (Server-Side Rendering)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">
                        Utilizado nas páginas estáticas como Início, Sobre e Política de Privacidade
                        para melhor SEO e performance inicial.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/30 bg-purple-500/10 pt-4">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-400">
                        CSR (Client-Side Rendering)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm">
                        Implementado no Catálogo de Lançamentos para interatividade e carregamento
                        dinâmico de dados.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-100">
                  Recursos de Acessibilidade
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  O projeto foi desenvolvido com foco em acessibilidade, seguindo as diretrizes WCAG
                  para garantir que todos os usuários, independentemente de suas capacidades, possam
                  utilizar a aplicação:
                </p>

                <Card className="border-slate-600 bg-slate-700/50 pt-4">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Accessibility className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-xl text-blue-400">
                        Funcionalidades de Acessibilidade
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                      <li>Navegação por teclado completa e intuitiva</li>
                      <li>Suporte a leitores de tela com ARIA labels apropriados</li>
                      <li>Contraste de cores adequado para usuários com baixa visão</li>
                      <li>Skip links para pular navegação repetitiva</li>
                      <li>Semântica HTML correta para melhor interpretação</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              <div className="pt-8 border-t border-slate-700 text-center">
                <Button asChild size="lg" className="px-8 py-4 text-base">
                  <Link href="/" scroll={false} aria-label="Ir à página inicial">
                    <ArrowLeft className="h-4 w-4" />
                    Ir ao Início
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}
