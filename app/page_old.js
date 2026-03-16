import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'

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

  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <LogoutButton />
      </div>

      <div className="card">
        <h2>Welcome, {session.user.name}</h2>
        <p>Role: {session.user.role}</p>
      </div>

      {session.user.role === 'admin' && (
        <div className="card">
          <h3>Admin Panel</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/admin/users" className="btn">Manage Users</Link>
            <Link href="/admin/content" className="btn">Manage Content</Link>
            <Link href="/admin/categories" className="btn">Manage Categories</Link>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Categories</h3>
        <div className="grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h4>{category.name}</h4>
              <p>{category.description}</p>
              <p>{category.resources.length} resources</p>
              <Link href={`/category/${category.id}`} className="btn">View Resources</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Recent Resources</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recentResources.map(resource => (
            <li key={resource.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{resource.title}</strong> - {resource.category.name}
              <br />
              {resource.description}
              <br />
              Type: {resource.type}
              <br />
              {resource.type === 'document' && <a href={resource.url} target="_blank" className="btn">View Document</a>}
              {resource.type === 'audio' && <audio controls src={resource.url} style={{ width: '100%' }}></audio>}
              {resource.type === 'video' && <a href={resource.url} target="_blank" className="btn">Watch Video</a>}
              {resource.type === 'image' && <img src={resource.url} alt={resource.title} style={{ maxWidth: '100%', height: 'auto' }} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}