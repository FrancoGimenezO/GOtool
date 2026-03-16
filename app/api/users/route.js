import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  return new Response(JSON.stringify(users), { status: 200 })
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { name, email, password, role } = await request.json()

  if (!name || !email || !password || !role) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  })

  return new Response(JSON.stringify({ message: 'User created', user: { id: user.id, name: user.name, email: user.email, role: user.role } }), { status: 201 })
}