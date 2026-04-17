export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  })
  if (!property) return NextResponse.json({ error: "Nao encontrado" }, { status: 404 })
  return NextResponse.json(property)
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await request.json()
  const property = await prisma.property.update({ where: { slug }, data: body })
  return NextResponse.json(property)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await prisma.property.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}
