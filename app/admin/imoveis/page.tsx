"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminImoveis() {
  const { status } = useSession()
  const router = useRouter()
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/imoveis")
        .then(r => r.json())
        .then(data => { setImoveis(data); setLoading(false) })
    }
  }, [status])

  async function toggleActive(slug: string, active: boolean) {
    await fetch("/api/imoveis/" + slug, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    })
    setImoveis((prev: any) => prev.map((i: any) => i.slug === slug ? { ...i, active: !active } : i))
  }

  async function deleteImovel(slug: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return
    await fetch("/api/imoveis/" + slug, { method: "DELETE" })
    setImoveis((prev: any) => prev.filter((i: any) => i.slug !== slug))
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Imóveis</h1>
        <div className="flex gap-4">
          <Link href="/admin/imoveis/novo" className="bg-[#C9A96E] text-white px-4 py-2 rounded-md text-sm font-medium">+ Novo Imóvel</Link>
          <Link href="/admin/dashboard" className="text-sm hover:text-[#C9A96E]">Dashboard</Link>
        </div>
      </header>
      <main className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : imoveis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum imóvel cadastrado ainda.</p>
            <Link href="/admin/imoveis/novo" className="bg-[#1B2A4A] text-white px-6 py-3 rounded-md font-medium">Cadastrar primeiro imóvel</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {imoveis.map((imovel: any) => (
              <div key={imovel.slug} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1B2A4A]">{imovel.title}</h3>
                  <p className="text-sm text-gray-500">{imovel.neighborhood} — {imovel.purpose === "venda" ? "Venda" : "Aluguel"} — R$ {imovel.price.toLocaleString("pt-BR")}</p>
                  <span className={imovel.active ? "text-green-600 text-xs font-medium" : "text-red-500 text-xs font-medium"}>
                    {imovel.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(imovel.slug, imovel.active)} className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                    {imovel.active ? "Desativar" : "Ativar"}
                  </button>
                  <Link href={"/admin/imoveis/" + imovel.slug} className="text-xs bg-[#1B2A4A] text-white px-3 py-1 rounded hover:bg-[#C9A96E]">Editar</Link>
                  <button onClick={() => deleteImovel(imovel.slug)} className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
