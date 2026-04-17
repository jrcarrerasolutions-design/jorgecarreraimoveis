"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [imoveis, setImoveis] = useState([])
  const [filtro, setFiltro] = useState({ purpose: "", type: "", neighborhood: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filtro.purpose) params.set("purpose", filtro.purpose)
    if (filtro.neighborhood) params.set("neighborhood", filtro.neighborhood)
    fetch("/api/imoveis?" + params.toString())
      .then(r => r.json())
      .then(data => { setImoveis(data); setLoading(false) })
  }, [filtro])

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] px-6 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold font-serif">Jorge Carrera</h1>
            <p className="text-[#C9A96E] text-sm">Corretor de Imóveis</p>
          </div>
          <a href="https://wa.me/5521996338178" target="_blank" className="bg-[#C9A96E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90">
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <section className="bg-[#1B2A4A] px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white text-center text-lg mb-6 opacity-80">Imóveis de alto padrão no Rio de Janeiro</p>
          <div className="bg-white rounded-xl p-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <select value={filtro.purpose} onChange={e => setFiltro(f => ({ ...f, purpose: e.target.value }))} className="border border-gray-200 rounded-md px-3 py-2 text-sm">
              <option value="">Venda ou Aluguel</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
            <select value={filtro.neighborhood} onChange={e => setFiltro(f => ({ ...f, neighborhood: e.target.value }))} className="border border-gray-200 rounded-md px-3 py-2 text-sm">
              <option value="">Todos os bairros</option>
              {["Barra da Tijuca","Joá","Leblon","Gávea","Ipanema","Copacabana","Botafogo","Búzios","Angra dos Reis"].map(b => <option key={b}>{b}</option>)}
            </select>
            <button className="bg-[#1B2A4A] text-white rounded-md py-2 text-sm font-medium hover:bg-[#C9A96E] transition-colors">Buscar</button>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-500">Carregando imóveis...</p>
        ) : imoveis.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Nenhum imóvel encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveis.map((imovel: any) => (
              <Link key={imovel.slug} href={"/imoveis/" + imovel.slug} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {imovel.images[0] ? (
                    <img src={imovel.images[0].url} alt={imovel.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sem foto</div>
                  )}
                  {imovel.featured && <span className="absolute top-2 left-2 bg-[#C9A96E] text-white text-xs px-2 py-1 rounded">Destaque</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1B2A4A] text-base mb-1">{imovel.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{imovel.neighborhood}</p>
                  <p className="text-[#C9A96E] font-bold">R$ {imovel.price.toLocaleString("pt-BR")}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    {imovel.bedrooms && <span>{imovel.bedrooms} quartos</span>}
                    {imovel.area && <span>{imovel.area} m²</span>}
                    {imovel.parking && <span>{imovel.parking} vagas</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#1B2A4A] text-white text-center py-8 px-6 mt-10">
        <p className="font-serif text-lg mb-1">Jorge Carrera Imóveis</p>
        <p className="text-[#C9A96E] text-sm mb-3">Atendimento exclusivo por WhatsApp</p>
        <a href="https://wa.me/5521996338178" target="_blank" className="text-sm underline hover:text-[#C9A96E]">(21) 99633-8178</a>
      </footer>
    </div>
  )
}
