import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { healthMonitor } from '@/lib/supabase-health'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    // Allow access if no auth is configured or if user is authenticated
    const authRequired = process.env.NEXTAUTH_URL && process.env.NEXTAUTH_SECRET
    if (authRequired && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Background health check (now safe - no circular dependencies)
    healthMonitor.checkSystemHealth().catch(error => 
      console.log('Background health check failed:', error)
    )

    // Check if we should use Supabase
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                       request.nextUrl.searchParams.get('source') !== 'local'

    if (useSupabase) {
      // Use Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: supabaseUsers, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        console.error('Supabase error, falling back to local:', error)
        // Fall back to local database
      } else if (supabaseUsers && supabaseUsers.length > 0) {
        // Map Supabase data to match our format
        const teamMembers = supabaseUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          position: user.position,
          location: user.location,
          avatar: user.avatar || null,
          overallRating: user.overall_rating || 70,
          skills: user.skills || [
            { name: 'JavaScript', level: Math.floor(Math.random() * 30) + 70 },
            { name: 'React', level: Math.floor(Math.random() * 30) + 60 },
            { name: 'Node.js', level: Math.floor(Math.random() * 30) + 50 },
            { name: 'TypeScript', level: Math.floor(Math.random() * 30) + 65 }
          ],
          _count: {
            tasks: 0,
            projects: 0
          },
          stats: {
            tasksCompleted: Math.floor(Math.random() * 50) + 10,
            projectsActive: 0,
            hoursLogged: Math.floor(Math.random() * 200) + 50
          }
        }))

        return NextResponse.json(teamMembers)
      }
    }

    // Use local Prisma database (default or fallback)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        position: true,
        location: true,
        avatar: true,
        overallRating: true,
        skills: true,
        _count: {
          select: {
            tasks: true,
            projects: true
          }
        }
      }
    })

    const teamMembers = users.map(user => ({
      ...user,
      stats: {
        tasksCompleted: Math.floor(Math.random() * 50) + 10,
        projectsActive: user._count.projects,
        hoursLogged: Math.floor(Math.random() * 200) + 50
      },
      skills: user.skills || [
        { name: 'JavaScript', level: Math.floor(Math.random() * 30) + 70 },
        { name: 'React', level: Math.floor(Math.random() * 30) + 60 },
        { name: 'Node.js', level: Math.floor(Math.random() * 30) + 50 },
        { name: 'TypeScript', level: Math.floor(Math.random() * 30) + 65 }
      ]
    }))

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, role, department, position, location, overallRating, skills } = body

    // Check if user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          role: role || 'USER',
          department,
          position,
          location,
          overallRating: overallRating || 70,
          skills: skills || null
        }
      })
      return NextResponse.json(updatedUser)
    } else {
      // Create new user with a default password (should be changed on first login)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: 'temp123', // Default password - should be changed
          role: role || 'USER',
          department,
          position,
          location,
          overallRating: overallRating || 70,
          skills: skills || null
        }
      })
      return NextResponse.json(newUser)
    }
  } catch (error) {
    console.error('Error creating/updating team member:', error)
    return NextResponse.json({ error: 'Failed to create/update team member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, email, role, department, position, overallRating, skills } = body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role: role || 'USER',
        department,
        position,
        overallRating: overallRating || 70,
        skills: skills || null
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}