export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const purpose = searchParams.get("purpose")
  const neighborhood = searchParams.get("neighborhood")

  const properties = await prisma.property.findMany({
    where: {
      active: true,
      ...(type && { type }),
      ...(purpose && { purpose }),
      ...(neighborhood && { neighborhood }),
    },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { featured: "desc" },
  })

  return NextResponse.json(properties)
}

export async function POST(request: Request) {
  const body = await request.json()
  const property = await prisma.property.create({ data: body })
  return NextResponse.json(property, { status: 201 })
}
