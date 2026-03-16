import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const category = await prisma.category.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      resources: {
        where: {
          permissions: {
            contains: `"${session.user.role}"`
          }
        }
      }
    }
  })

  if (!category) {
    return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 })
  }

  return new Response(JSON.stringify(category), { status: 200 })
}