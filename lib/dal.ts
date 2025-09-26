import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { issues, users } from '@/db/schema'
import { mockDelay } from './utils'

//Current user
export const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) return null

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return result[0] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

//Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.email, email))

    return result[0] || null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

//Get issues
export async function getIssues() {
  const session = await getSession()
  if (!session) return null

  try {
    const result = await db.query.issues.findMany({
      where: (issues, { eq }) => eq(issues.userId, session.userId),
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    })
    return result
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}

//Get issue
export async function getIssue(id: number) {
  const session = await getSession()
  if (!session) return null

  try {
    const result = await db.query.issues.findFirst({
      where: (issues, { eq }) => eq(issues.id, id),
      with: { user: true },
    })

    return result
  } catch (error) {
    console.error('Error getting issue:', error)
    return null
  }
}
