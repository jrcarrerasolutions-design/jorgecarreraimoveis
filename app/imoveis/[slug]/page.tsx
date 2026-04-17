"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function ImovelDetalhe() {
  const { slug } = useParams()
  const [imovel, setImovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState({ name: "", phone: "", email: "", message: "" })
  const [enviado, setEnviado] = useState(false)
  const [fotoAtual, setFotoAtual] = useState(0)

  useEffect(() => {
    fetch("/api/imoveis/" + slug)
      .then(r => r.json())
      .then(data => { setImovel(data); setLoading(false) })
  }, [slug])

  async function handleLead(e: any) {
    e.preventDefault()
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, propertyId: imovel.id }),
    })
    setEnviado(true)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">Carregando...</div>
  if (!imovel) return <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">Imóvel não encontrado.</div>

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] px-6 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-white font-serif text-xl font-bold">Jorge Carrera Imóveis</Link>
          <a href="https://wa.me/5521996338178" target="_blank" className="bg-[#C9A96E] text-white px-4 py-2 rounded-md text-sm font-medium">WhatsApp</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#1B2A4A] mb-4 inline-block">← Voltar</Link>

        {imovel.images.length > 0 && (
          <div className="mb-6">
            <img src={imovel.images[fotoAtual].url} alt={imovel.title} className="w-full h-80 object-cover rounded-xl" />
            {imovel.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {imovel.images.map((img: any, i: number) => (
                  <img key={img.id} src={img.url} alt="" onClick={() => setFotoAtual(i)}
                    className={"h-16 w-24 object-cover rounded cursor-pointer border-2 " + (i === fotoAtual ? "border-[#C9A96E]" : "border-transparent")} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-[#1B2A4A] font-serif mb-1">{imovel.title}</h1>
            <p className="text-gray-500 mb-4">{imovel.neighborhood}, {imovel.city}</p>
            <p className="text-3xl font-bold text-[#C9A96E] mb-6">R$ {imovel.price.toLocaleString("pt-BR")}</p>
            <div className="flex gap-4 mb-6 flex-wrap">
              {imovel.bedrooms && <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 shadow-sm">{imovel.bedrooms} quartos</span>}
              {imovel.bathrooms && <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 shadow-sm">{imovel.bathrooms} banheiros</span>}
              {imovel.parking && <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 shadow-sm">{imovel.parking} vagas</span>}
              {imovel.area && <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 shadow-sm">{imovel.area} m²</span>}
            </div>
            {imovel.description && <p className="text-gray-600 leading-relaxed">{imovel.description}</p>}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
            {enviado ? (
              <div className="text-center">
                <p className="text-green-600 font-bold mb-2">Mensagem enviada!</p>
                <p className="text-sm text-gray-500">Jorge entrará em contato em breve pelo WhatsApp.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-[#1B2A4A] mb-4">Tenho interesse</h3>
                <form onSubmit={handleLead} className="space-y-3">
                  <input placeholder="Seu nome" required value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" />
                  <input placeholder="WhatsApp" required value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" />
                  <input placeholder="Email (opcional)" value={lead.email} onChange={e => setLead(l => ({ ...l, email: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" />
                  <textarea placeholder="Mensagem (opcional)" value={lead.message} onChange={e => setLead(l => ({ ...l, message: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" />
                  <button type="submit" className="w-full bg-[#1B2A4A] text-white py-2 rounded-md hover:bg-[#C9A96E] transition-colors text-sm font-medium">Enviar mensagem</button>
                </form>
                <a href={"https://wa.me/5521996338178?text=Olá, tenho interesse no imóvel: " + imovel.title} target="_blank" className="block text-center mt-3 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium">
                  Chamar no WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
