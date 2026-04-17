"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const BAIRROS = ["Barra da Tijuca","Joá","Leblon","Gávea","Ipanema","Copacabana","Botafogo","Búzios","Angra dos Reis"]
const TIPOS_RES = ["Apartamento","Casa","Cobertura","Terreno residencial"]
const TIPOS_COM = ["Sala/Conjunto","Loja","Galpão","Andar Corrido","Prédio Inteiro","Terreno comercial"]

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now()
}

export default function NovoImovel() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("Residencial")
  const [form, setForm] = useState({
    title: "", description: "", type: "", subtype: "", purpose: "venda",
    price: "", area: "", bedrooms: "", bathrooms: "", parking: "",
    front: "", zoning: "", neighborhood: "Barra da Tijuca", featured: false,
  })

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    const slug = slugify(form.title)
    const body = {
      ...form,
      slug,
      price: parseFloat(form.price),
      area: form.area ? parseFloat(form.area) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      parking: form.parking ? parseInt(form.parking) : null,
      front: form.front ? parseFloat(form.front) : null,
    }
    const res = await fetch("/api/imoveis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      router.push("/admin/imoveis")
    } else {
      alert("Erro ao cadastrar imóvel")
      setLoading(false)
    }
  }

  const tipos = category === "Residencial" ? TIPOS_RES : TIPOS_COM

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Novo Imóvel</h1>
        <Link href="/admin/imoveis" className="text-sm hover:text-[#C9A96E]">Voltar</Link>
      </header>
      <main className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Residencial</option>
                <option>Comercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select name="subtype" value={form.subtype} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Selecione</option>
                {tipos.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Finalidade</label>
              <select name="purpose" value={form.purpose} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <select name="neighborhood" value={form.neighborhood} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2">
                {BAIRROS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input name="area" type="number" value={form.area} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
              <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
              <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
              <input name="parking" type="number" value={form.parking} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured" className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Destacar na página inicial</label>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1B2A4A] text-white py-3 rounded-md hover:bg-[#C9A96E] transition-colors font-medium">
            {loading ? "Salvando..." : "Cadastrar Imóvel"}
          </button>
        </form>
      </main>
    </div>
  )
}
