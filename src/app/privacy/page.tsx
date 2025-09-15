import Link from 'next/link'
import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Política de Privacidade - SpaceX Launch Portal',
  description: 'Política de privacidade e termos de uso do SpaceX Launch Portal',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main
        id="conteudo-principal"
        className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12"
        role="main"
        tabIndex={-1}
      >
        <div className="mx-auto max-w-4xl px-4">
          <article className="bg-slate-800/50 rounded-2xl p-8 ring-1 ring-white/10 backdrop-blur">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
              <p className="text-slate-300">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </header>

            <div className="prose prose-invert prose-slate max-w-none">
              <Card className="border-slate-700/50 bg-slate-800/50 ring-1 ring-white/10 backdrop-blur text-slate-300 pt-4">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-bold">Licença MIT</CardTitle>
                  <CardDescription className="text-slate-300 text-lg">
                    Copyright (c) 2025 gustah90
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <section className="mb-8">
                    <div>
                      <p className="mb-4">
                        Permission is hereby granted, free of charge, to any person obtaining a copy
                        of this software and associated documentation files (the
                        &quot;Software&quot;), to deal in the Software without restriction,
                        including without limitation the rights to use, copy, modify, merge,
                        publish, distribute, sublicense, and/or sell copies of the Software, and to
                        permit persons to whom the Software is furnished to do so, subject to the
                        following conditions:
                      </p>

                      <p className="mb-4">
                        The above copyright notice and this permission notice shall be included in
                        all copies or substantial portions of the Software.
                      </p>

                      <p className="mb-4">
                        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND,
                        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
                        EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                        DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                        OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                        USE OR OTHER DEALINGS IN THE SOFTWARE.
                      </p>
                    </div>
                  </section>
                </CardContent>
              </Card>

              <section className="my-8">
                <h2 className="text-2xl font-semibold mb-4">Coleta de Dados</h2>
                <p className="mb-4">
                  O SpaceX Launch Portal é um projeto de código aberto e{' '}
                  <strong>não coleta nenhum dado pessoal</strong> dos usuários. Todas as informações
                  exibidas são provenientes da API pública da SpaceX.
                </p>

                <p className="mb-4">
                  Este site não utiliza cookies de rastreamento, não armazena informações pessoais e
                  não realiza nenhum tipo de analytics que identifique usuários individualmente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Dados Técnicos</h2>
                <p className="mb-4">
                  Para fins de otimização de performance, o site pode armazenar em cache as
                  informações da API da SpaceX, mas esses dados são completamente anônimos e não
                  contêm informações pessoais.
                </p>
              </section>
            </div>

            <div className="pt-8 border-t border-slate-700 text-center">
              <Button asChild size="lg" className="px-8 py-4 text-base">
                <Link href="/" aria-label="Ir à página inicial">
                  <ArrowLeft className="h-4 w-4" />
                  Ir ao Início
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}
