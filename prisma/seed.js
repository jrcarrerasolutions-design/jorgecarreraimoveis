const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
const bcrypt = require('bcryptjs')

const adapter = new PrismaLibSql({ url: 'file:/home/jorge/jorgecarreraimoveis/prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'jorge@jorgecarreraimoveis.com.br' },
    update: {},
    create: {
      email: 'jorge@jorgecarreraimoveis.com.br',
      password: hash,
      name: 'Jorge Carrera',
    },
  })
  console.log('Admin criado:', user.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())
