import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock team data for deployment
    const teamMembers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        department: 'Engineering',
        position: 'Senior Developer',
        location: 'Remote',
        avatar: null,
        overallRating: 85,
        skills: [
          { name: 'JavaScript', level: 90 },
          { name: 'React', level: 85 },
          { name: 'Node.js', level: 80 },
          { name: 'TypeScript', level: 75 }
        ],
        _count: { tasks: 12, projects: 3 },
        stats: {
          tasksCompleted: 35,
          projectsActive: 3,
          hoursLogged: 160
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'USER',
        department: 'Design',
        position: 'UI/UX Designer',
        location: 'New York',
        avatar: null,
        overallRating: 78,
        skills: [
          { name: 'Figma', level: 95 },
          { name: 'Sketch', level: 80 },
          { name: 'CSS', level: 85 },
          { name: 'Design Systems', level: 90 }
        ],
        _count: { tasks: 8, projects: 2 },
        stats: {
          tasksCompleted: 28,
          projectsActive: 2,
          hoursLogged: 140
        }
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'USER',
        department: 'Marketing',
        position: 'Marketing Manager',
        location: 'San Francisco',
        avatar: null,
        overallRating: 72,
        skills: [
          { name: 'SEO', level: 88 },
          { name: 'Content Strategy', level: 85 },
          { name: 'Analytics', level: 75 },
          { name: 'Social Media', level: 80 }
        ],
        _count: { tasks: 6, projects: 2 },
        stats: {
          tasksCompleted: 22,
          projectsActive: 2,
          hoursLogged: 120
        }
      }
    ]

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, department, position, location, overallRating, skills } = body

    // Mock response for deployment
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: role || 'USER',
      department,
      position,
      location,
      overallRating: overallRating || 70,
      skills: skills || [
        { name: 'JavaScript', level: 70 },
        { name: 'React', level: 60 },
        { name: 'Node.js', level: 50 },
        { name: 'TypeScript', level: 65 }
      ],
      _count: { tasks: 0, projects: 0 },
      stats: {
        tasksCompleted: 0,
        projectsActive: 0,
        hoursLogged: 0
      }
    }

    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, role, department, position, overallRating, skills } = body

    // Mock response for deployment
    const updatedUser = {
      id,
      name,
      email,
      role: role || 'USER',
      department,
      position,
      overallRating: overallRating || 70,
      skills: skills || [
        { name: 'JavaScript', level: 70 },
        { name: 'React', level: 60 },
        { name: 'Node.js', level: 50 },
        { name: 'TypeScript', level: 65 }
      ],
      _count: { tasks: 0, projects: 0 },
      stats: {
        tasksCompleted: 0,
        projectsActive: 0,
        hoursLogged: 0
      }
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}