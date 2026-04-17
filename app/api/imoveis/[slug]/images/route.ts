import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await request.json()
  const property = await prisma.property.findUnique({ where: { slug } })
  if (!property) return NextResponse.json({ error: "Nao encontrado" }, { status: 404 })
  const image = await prisma.propertyImage.create({
    data: {
      url: body.url,
      publicId: body.publicId,
      order: body.order ?? 0,
      propertyId: property.id,
    },
  })
  return NextResponse.json(image, { status: 201 })
}
