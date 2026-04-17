"use client"
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({ imoveis: 0, leads: 0 })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login")
  }, [status, router])

  useEffect(() => {
    async function loadStats() {
      const [imoveis, leads] = await Promise.all([
        fetch("/api/imoveis").then(r => r.json()),
        fetch("/api/leads").then(r => r.json()),
      ])
      setStats({ imoveis: imoveis.length, leads: leads.length })
    }
    if (status === "authenticated") loadStats()
  }, [status])

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Jorge Carrera Imóveis — Admin</h1>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="text-sm hover:text-[#C9A96E]">Sair</button>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1B2A4A] mb-6">Bem-vindo, {session?.user?.name}</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Imóveis cadastrados</p>
            <p className="text-4xl font-bold text-[#1B2A4A] mt-1">{stats.imoveis}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Leads recebidos</p>
            <p className="text-4xl font-bold text-[#C9A96E] mt-1">{stats.leads}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/admin/imoveis" className="bg-[#1B2A4A] text-white px-6 py-4 rounded-lg hover:bg-[#C9A96E] transition-colors text-center font-medium">
            Gerenciar Imóveis
          </Link>
          <Link href="/admin/leads" className="bg-white text-[#1B2A4A] px-6 py-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium border border-gray-200">
            Ver Leads
          </Link>
          <Link href="/" target="_blank" className="bg-white text-[#1B2A4A] px-6 py-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium border border-gray-200">
            Ver Site
          </Link>
        </div>
      </main>
    </div>
  )
}
