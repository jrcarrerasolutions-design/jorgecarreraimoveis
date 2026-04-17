"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLeads() {
  const { status } = useSession()
  const router = useRouter()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/leads")
        .then(r => r.json())
        .then(data => { setLeads(data); setLoading(false) })
    }
  }, [status])

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Leads</h1>
        <Link href="/admin/dashboard" className="text-sm hover:text-[#C9A96E]">Dashboard</Link>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : leads.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Nenhum lead recebido ainda.</p>
        ) : (
          <div className="space-y-3">
            {leads.map((lead: any) => (
              <div key={lead.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#1B2A4A]">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                    {lead.email && <p className="text-sm text-gray-600">{lead.email}</p>}
                    {lead.message && <p className="text-sm text-gray-500 mt-1">{lead.message}</p>}
                    {lead.property && <p className="text-xs text-[#C9A96E] mt-1">Imóvel: {lead.property.title}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</p>
                    <a href={"https://wa.me/55" + lead.phone.replace(/\D/g,"")} target="_blank" className="text-xs bg-green-500 text-white px-3 py-1 rounded mt-2 inline-block hover:bg-green-600">
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
