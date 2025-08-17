const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const teamMembers = [
  {
    name: "Kyle Pernell",
    email: "kyle.pernell@company.com",
    position: "Digital Marketing Automation & Funnel Specialist",
    department: "CRM & Automations",
    location: "Philadelphia, PA",
    overallRating: 91,
    role: "USER",
    skills: [
      { name: "Marketing Automation", level: 95 },
      { name: "Funnel Design", level: 92 },
      { name: "CRM Management", level: 88 },
      { name: "Lead Generation", level: 90 }
    ]
  },
  {
    name: "Darvin Sanchez",
    email: "darvin.sanchez@company.com",
    position: "Travel Photography & Videography Specialist",
    department: "Travel Media",
    location: "Manchester, NH",
    overallRating: 89,
    role: "USER",
    skills: [
      { name: "Photography", level: 95 },
      { name: "Videography", level: 90 },
      { name: "Travel Content", level: 92 },
      { name: "Video Editing", level: 87 }
    ]
  },
  {
    name: "Benito Pak",
    email: "benito.pak@company.com",
    position: "Technical Infrastructure & Development Lead",
    department: "Development",
    location: "Killeen, TX",
    overallRating: 94,
    role: "ADMIN",
    skills: [
      { name: "Infrastructure", level: 96 },
      { name: "System Architecture", level: 94 },
      { name: "DevOps", level: 92 },
      { name: "Cloud Services", level: 90 }
    ]
  },
  {
    name: "Harry Castaner",
    email: "harry.castaner@company.com",
    position: "Lead Developer & AI Solutions Architect",
    department: "Development",
    location: "Clayton, NJ",
    overallRating: 96,
    role: "ADMIN",
    skills: [
      { name: "AI/ML", level: 98 },
      { name: "Full Stack Development", level: 95 },
      { name: "Architecture Design", level: 96 },
      { name: "Python", level: 94 },
      { name: "JavaScript", level: 92 }
    ]
  },
  {
    name: "Latrice Jones",
    email: "latrice.jones@company.com",
    position: "Social Media Strategy & Content Manager",
    department: "Social Media",
    location: "Atlanta, GA",
    overallRating: 88,
    role: "USER",
    skills: [
      { name: "Social Media Strategy", level: 92 },
      { name: "Content Creation", level: 90 },
      { name: "Community Management", level: 88 },
      { name: "Analytics", level: 85 }
    ]
  },
  {
    name: "Daran Chandrasekaran",
    email: "daran.chandrasekaran@company.com",
    position: "Data Analytics & Business Intelligence Specialist",
    department: "Development",
    location: "Palo Alto, CA",
    overallRating: 93,
    role: "USER",
    skills: [
      { name: "Data Analytics", level: 96 },
      { name: "Business Intelligence", level: 94 },
      { name: "SQL", level: 92 },
      { name: "Python", level: 90 },
      { name: "Tableau", level: 88 }
    ]
  },
  {
    name: "Nebiyu",
    email: "nebiyu@company.com",
    position: "Frontend Development & UX/UI Designer",
    department: "Development",
    location: "Seattle, WA",
    overallRating: 89,
    role: "USER",
    skills: [
      { name: "Frontend Development", level: 92 },
      { name: "UX/UI Design", level: 90 },
      { name: "React", level: 88 },
      { name: "Design Systems", level: 86 }
    ]
  },
  {
    name: "Nicholas Magee-Baker",
    email: "nicholas.magee-baker@company.com",
    position: "Sales Strategy & Client Relations Manager",
    department: "Sales",
    location: "Chicago, IL",
    overallRating: 93,
    role: "USER",
    skills: [
      { name: "Sales Strategy", level: 96 },
      { name: "Client Relations", level: 94 },
      { name: "Negotiation", level: 92 },
      { name: "CRM", level: 88 }
    ]
  },
  {
    name: "Eddy Alvarez",
    email: "eddy.alvarez@company.com",
    position: "Graphic Design & Brand Identity Specialist",
    department: "Digital Design",
    location: "Miami, FL",
    overallRating: 86,
    role: "USER",
    skills: [
      { name: "Graphic Design", level: 90 },
      { name: "Brand Identity", level: 88 },
      { name: "Adobe Creative Suite", level: 92 },
      { name: "Logo Design", level: 85 }
    ]
  },
  {
    name: "Jonella Carino",
    email: "jonella.carino@company.com",
    position: "Project Management & Operations Coordinator",
    department: "CRM & Automations",
    location: "Las Vegas, NV",
    overallRating: 90,
    role: "USER",
    skills: [
      { name: "Project Management", level: 94 },
      { name: "Operations", level: 92 },
      { name: "Agile/Scrum", level: 88 },
      { name: "Process Optimization", level: 86 }
    ]
  },
  {
    name: "Giovanny Sims",
    email: "giovanny.sims@company.com",
    position: "Backend Development & Database Specialist",
    department: "Development",
    location: "Houston, TX",
    overallRating: 91,
    role: "USER",
    skills: [
      { name: "Backend Development", level: 94 },
      { name: "Database Design", level: 92 },
      { name: "API Development", level: 90 },
      { name: "SQL", level: 88 }
    ]
  },
  {
    name: "Justin Smith",
    email: "justin.smith@company.com",
    position: "SEO & Content Marketing Specialist",
    department: "CRM & Automations",
    location: "Phoenix, AZ",
    overallRating: 87,
    role: "USER",
    skills: [
      { name: "SEO", level: 92 },
      { name: "Content Marketing", level: 90 },
      { name: "Analytics", level: 85 },
      { name: "Keyword Research", level: 88 }
    ]
  },
  {
    name: "Christmas M. Briones",
    email: "christmas.briones@company.com",
    position: "Quality Assurance & Testing Specialist",
    department: "Development",
    location: "San Francisco, CA",
    overallRating: 88,
    role: "USER",
    skills: [
      { name: "Quality Assurance", level: 92 },
      { name: "Testing Automation", level: 88 },
      { name: "Bug Tracking", level: 90 },
      { name: "Test Planning", level: 86 }
    ]
  },
  {
    name: "Kenny Dango",
    email: "kenny.dango@company.com",
    position: "Business Development & Partnership Manager",
    department: "Sales",
    location: "Dallas, TX",
    overallRating: 91,
    role: "USER",
    skills: [
      { name: "Business Development", level: 94 },
      { name: "Partnership Management", level: 92 },
      { name: "Strategic Planning", level: 90 },
      { name: "Relationship Building", level: 88 }
    ]
  },
  {
    name: "Steven Garcia Puesan",
    email: "steven.garcia@company.com",
    position: "Cybersecurity & DevOps Specialist",
    department: "Development",
    location: "Denver, CO",
    overallRating: 92,
    role: "USER",
    skills: [
      { name: "Cybersecurity", level: 95 },
      { name: "DevOps", level: 92 },
      { name: "Security Auditing", level: 90 },
      { name: "Infrastructure Security", level: 88 }
    ]
  },
  {
    name: "Leilani Bernardo",
    email: "leilani.bernardo@company.com",
    position: "Content Creation & Digital Strategy Specialist",
    department: "Digital Design",
    location: "Honolulu, HI",
    overallRating: 85,
    role: "USER",
    skills: [
      { name: "Content Creation", level: 88 },
      { name: "Digital Strategy", level: 86 },
      { name: "Social Media", level: 90 },
      { name: "Creative Writing", level: 82 }
    ]
  },
  {
    name: "Jun Bernardo",
    email: "jun.bernardo@company.com",
    position: "Mobile App Development & Cross-Platform Specialist",
    department: "Development",
    location: "Honolulu, HI",
    overallRating: 89,
    role: "USER",
    skills: [
      { name: "Mobile Development", level: 92 },
      { name: "Cross-Platform", level: 90 },
      { name: "React Native", level: 88 },
      { name: "iOS/Android", level: 86 }
    ]
  },
  {
    name: "Destyn Mai",
    email: "destyn.mai@company.com",
    position: "E-commerce & Digital Product Specialist",
    department: "CRM & Automations",
    location: "Portland, OR",
    overallRating: 88,
    role: "USER",
    skills: [
      { name: "E-commerce", level: 92 },
      { name: "Digital Products", level: 90 },
      { name: "Product Management", level: 86 },
      { name: "Conversion Optimization", level: 88 }
    ]
  },
  {
    name: "Trey Smith",
    email: "trey.smith@company.com",
    position: "Creative Graphics & Multi-Media Specialist",
    department: "Digital Design",
    location: "Chester, PA",
    overallRating: 90,
    role: "USER",
    skills: [
      { name: "Graphic Design", level: 94 },
      { name: "Multi-Media", level: 92 },
      { name: "Video Production", level: 88 },
      { name: "Creative Direction", level: 90 }
    ]
  }
]

async function addTeamMembers() {
  try {
    console.log('Adding team members to database...')
    
    for (const member of teamMembers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: member.email }
      })
      
      if (existingUser) {
        console.log(`Updating existing user: ${member.name}`)
        await prisma.user.update({
          where: { email: member.email },
          data: {
            name: member.name,
            position: member.position,
            department: member.department,
            overallRating: member.overallRating,
            role: member.role,
            skills: member.skills
          }
        })
      } else {
        console.log(`Creating new user: ${member.name}`)
        await prisma.user.create({
          data: {
            name: member.name,
            email: member.email,
            password: 'temp123', // Default password - should be changed
            position: member.position,
            department: member.department,
            overallRating: member.overallRating,
            role: member.role,
            skills: member.skills
          }
        })
      }
    }
    
    console.log('✅ All team members added successfully!')
    
    // Show summary
    const totalUsers = await prisma.user.count()
    const departments = await prisma.user.groupBy({
      by: ['department'],
      _count: { id: true },
      where: { department: { not: null } }
    })
    
    console.log(`\n📊 Summary:`)
    console.log(`Total team members: ${totalUsers}`)
    console.log(`Departments:`)
    departments.forEach(dept => {
      console.log(`  - ${dept.department}: ${dept._count.id} members`)
    })
    
  } catch (error) {
    console.error('Error adding team members:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTeamMembers()