const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  })

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 10)
  await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      name: 'Agent',
      email: 'agent@example.com',
      password: agentPassword,
      role: 'agent'
    }
  })

  // Create categories
  const guiones = await prisma.category.upsert({
    where: { name: 'Guiones de venta' },
    update: {},
    create: { name: 'Guiones de venta', description: 'Scripts para ventas' }
  })

  const objeciones = await prisma.category.upsert({
    where: { name: 'Manejo de objeciones' },
    update: {},
    create: { name: 'Manejo de objeciones', description: 'Cómo manejar objeciones comunes' }
  })

  const llamadas = await prisma.category.upsert({
    where: { name: 'Ejemplos de llamadas' },
    update: {},
    create: { name: 'Ejemplos de llamadas', description: 'Grabaciones de llamadas exitosas' }
  })

  const videos = await prisma.category.upsert({
    where: { name: 'Videos de entrenamiento' },
    update: {},
    create: { name: 'Videos de entrenamiento', description: 'Videos de capacitación' }
  })

  // Create resources
  await prisma.resource.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Guion básico de venta',
      description: 'Guion para principiantes',
      type: 'document',
      url: '/docs/guion-basico.pdf',
      categoryId: guiones.id,
      permissions: '{"roles": ["admin", "agent"]}'
    }
  })

  await prisma.resource.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Manejo de precio alto',
      description: 'Cómo responder a objeciones de precio',
      type: 'audio',
      url: '/audios/objecion-precio.mp3',
      categoryId: objeciones.id,
      permissions: '{"roles": ["admin", "agent"]}'
    }
  })

  await prisma.resource.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Llamada exitosa',
      description: 'Ejemplo de cierre exitoso',
      type: 'audio',
      url: '/audios/llamada-exitosa.mp3',
      categoryId: llamadas.id,
      permissions: '{"roles": ["admin"]}' // Only admin can see
    }
  })

  await prisma.resource.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: 'Introducción a ventas',
      description: 'Video de introducción al proceso de ventas',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example',
      categoryId: videos.id,
      permissions: '{"roles": ["admin", "agent"]}'
    }
  })

  console.log('Database seeded with users, categories, and resources')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })