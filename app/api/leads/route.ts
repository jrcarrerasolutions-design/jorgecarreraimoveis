export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const leads = await prisma.lead.findMany({
    include: { property: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  const body = await request.json()
  const lead = await prisma.lead.create({ data: body })
  return NextResponse.json(lead, { status: 201 })
}
