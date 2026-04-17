export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params
  await prisma.propertyImage.delete({ where: { id: imageId } })
  return NextResponse.json({ ok: true })
}
