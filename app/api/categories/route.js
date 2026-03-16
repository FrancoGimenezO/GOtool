import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const categories = await prisma.category.findMany()

  return new Response(JSON.stringify(categories), { status: 200 })
}