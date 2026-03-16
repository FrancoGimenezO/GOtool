import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { title, description, type, url, categoryId, permissions } = await request.json()

  if (!title || !type || !url || !categoryId || !permissions) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  try {
    const resource = await prisma.resource.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        type,
        url,
        categoryId,
        permissions
      },
      include: {
        category: true
      }
    })

    return new Response(JSON.stringify({ message: 'Resource updated', resource }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await prisma.resource.delete({
      where: { id: parseInt(params.id) }
    })

    return new Response(JSON.stringify({ message: 'Resource deleted' }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }
}