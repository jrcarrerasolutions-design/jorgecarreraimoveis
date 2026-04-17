const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

const globalForPrisma = globalThis

function createPrismaClient() {
  const adapter = new PrismaLibSql({ url: 'file:/home/jorge/jorgecarreraimoveis/prisma/dev.db' })
  return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

module.exports = { prisma }
