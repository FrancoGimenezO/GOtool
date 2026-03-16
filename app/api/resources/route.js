import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const resources = await prisma.resource.findMany({
    include: {
      category: true
    }
  })

  return new Response(JSON.stringify(resources), { status: 200 })
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { title, description, type, url, categoryId, permissions } = await request.json()

  if (!title || !type || !url || !categoryId || !permissions) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  const resource = await prisma.resource.create({
    data: {
      title,
      description,
      type,
      url,
      categoryId,
      permissions
    }
  })

  return new Response(JSON.stringify({ message: 'Resource created', resource }), { status: 201 })
}