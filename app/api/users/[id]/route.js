import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { name, email, password, role } = await request.json()

  if (!name || !email || !role) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  try {
    const updateData = {
      name,
      email,
      role
    }

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return new Response(JSON.stringify({ message: 'User updated', user }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User not found or email already exists' }), { status: 404 })
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) }
    })

    return new Response(JSON.stringify({ message: 'User deleted' }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }
}