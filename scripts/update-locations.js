const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const locationUpdates = [
  { email: "kyle.pernell@company.com", location: "Philadelphia, PA" },
  { email: "darvin.sanchez@company.com", location: "Manchester, NH" },
  { email: "benito.pak@company.com", location: "Killeen, TX" },
  { email: "harry.castaner@company.com", location: "Clayton, NJ" },
  { email: "latrice.jones@company.com", location: "Atlanta, GA" },
  { email: "daran.chandrasekaran@company.com", location: "Palo Alto, CA" },
  { email: "nebiyu@company.com", location: "Seattle, WA" },
  { email: "nicholas.magee-baker@company.com", location: "Chicago, IL" },
  { email: "eddy.alvarez@company.com", location: "Miami, FL" },
  { email: "jonella.carino@company.com", location: "Las Vegas, NV" },
  { email: "giovanny.sims@company.com", location: "Houston, TX" },
  { email: "justin.smith@company.com", location: "Phoenix, AZ" },
  { email: "christmas.briones@company.com", location: "San Francisco, CA" },
  { email: "kenny.dango@company.com", location: "Dallas, TX" },
  { email: "steven.garcia@company.com", location: "Denver, CO" },
  { email: "leilani.bernardo@company.com", location: "Honolulu, HI" },
  { email: "jun.bernardo@company.com", location: "Honolulu, HI" },
  { email: "destyn.mai@company.com", location: "Portland, OR" },
  { email: "trey.smith@company.com", location: "Chester, PA" }
]

async function updateLocations() {
  try {
    console.log('Updating team member locations...')
    
    for (const update of locationUpdates) {
      await prisma.user.update({
        where: { email: update.email },
        data: { location: update.location }
      })
      console.log(`Updated location for ${update.email}: ${update.location}`)
    }
    
    console.log('✅ All locations updated successfully!')
    
  } catch (error) {
    console.error('Error updating locations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateLocations()