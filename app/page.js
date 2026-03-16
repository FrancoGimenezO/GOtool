import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import HomeContent from './components/HomeContent'

const prisma = new PrismaClient()

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
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

  // Fetch recent resources
  const recentResources = await prisma.resource.findMany({
    where: {
      permissions: {
        contains: `"${session.user.role}"`
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    include: {
      category: true
    }
  })

  return <HomeContent session={session} categories={categories} recentResources={recentResources} />
}