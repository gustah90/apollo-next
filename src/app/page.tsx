import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Apollo Next</h1>

      <nav className="mt-4">
        <Link href="/about" className="underline">
          About
        </Link>
      </nav>
    </main>
  )
}
