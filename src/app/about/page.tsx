import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="p-6">
      <nav className="mt-4">
        <Link href="/" className="underline">
          Voltar à Página Inicial
        </Link>
      </nav>
      <h1 className="text-2xl font-bold">About Page</h1>
      <p>Minimal page for E2E navigation test.</p>
    </main>
  )
}
