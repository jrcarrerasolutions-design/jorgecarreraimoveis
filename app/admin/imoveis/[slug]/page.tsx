"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function EditarImovel() {
  const { slug } = useParams()
  const [imovel, setImovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [uploadando, setUploadando] = useState(false)

  useEffect(() => {
    fetch("/api/imoveis/" + slug).then(r => r.json()).then(data => { setImovel(data); setLoading(false) })
  }, [slug])

  async function handleSalvar(e: any) {
    e.preventDefault()
    setSalvando(true)
    await fetch("/api/imoveis/" + slug, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: imovel.title, description: imovel.description, price: imovel.price, area: imovel.area, bedrooms: imovel.bedrooms, bathrooms: imovel.bathrooms, parking: imovel.parking, neighborhood: imovel.neighborhood, featured: imovel.featured, active: imovel.active }),
    })
    setSalvando(false)
    alert("Salvo!")
  }

  async function handleUpload(e: any) {
    const files = e.target.files
    if (!files || !files.length) return
    setUploadando(true)
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append("file", files[i])
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      await fetch("/api/imoveis/" + slug + "/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.secure_url, publicId: data.public_id, order: i }),
      })
    }
    const updated = await fetch("/api/imoveis/" + slug).then(r => r.json())
    setImovel(updated)
    setUploadando(false)
  }

  async function handleDeleteImage(imageId: string) {
    await fetch("/api/imoveis/" + slug + "/images/" + imageId, { method: "DELETE" })
    setImovel((prev: any) => ({ ...prev, images: prev.images.filter((img: any) => img.id !== imageId) }))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-[#1B2A4A] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Editar Imovel</h1>
        <Link href="/admin/imoveis" className="text-sm hover:text-[#C9A96E]">Voltar</Link>
      </header>
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-[#1B2A4A] mb-4">Fotos</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {imovel.images.map((img: any) => (
              <div key={img.id} className="relative">
                <img src={img.url} alt="" className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => handleDeleteImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">x</button>
              </div>
            ))}
          </div>
          <label className="block">
            <span className="bg-[#1B2A4A] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#C9A96E] text-sm">{uploadando ? "Enviando..." : "+ Adicionar Fotos"}</span>
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploadando} />
          </label>
        </div>
        <form onSubmit={handleSalvar} className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-[#1B2A4A] mb-2">Dados do Imovel</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
            <input value={imovel.title} onChange={e => setImovel((p: any) => ({ ...p, title: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preco (R$)</label>
              <input type="number" value={imovel.price} onChange={e => setImovel((p: any) => ({ ...p, price: parseFloat(e.target.value) }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (m2)</label>
              <input type="number" value={imovel.area || ""} onChange={e => setImovel((p: any) => ({ ...p, area: parseFloat(e.target.value) }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
              <input type="number" value={imovel.bedrooms || ""} onChange={e => setImovel((p: any) => ({ ...p, bedrooms: parseInt(e.target.value) }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
              <input type="number" value={imovel.bathrooms || ""} onChange={e => setImovel((p: any) => ({ ...p, bathrooms: parseInt(e.target.value) }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
              <input type="number" value={imovel.parking || ""} onChange={e => setImovel((p: any) => ({ ...p, parking: parseInt(e.target.value) }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descricao</label>
            <textarea rows={4} value={imovel.description || ""} onChange={e => setImovel((p: any) => ({ ...p, description: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={imovel.featured} onChange={e => setImovel((p: any) => ({ ...p, featured: e.target.checked }))} id="featured" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Destacar na pagina inicial</label>
          </div>
          <button type="submit" disabled={salvando} className="w-full bg-[#1B2A4A] text-white py-3 rounded-md hover:bg-[#C9A96E] transition-colors font-medium">{salvando ? "Salvando..." : "Salvar Alteracoes"}</button>
        </form>
      </main>
    </div>
  )
}
