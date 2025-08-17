const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function fixPasswords() {
  try {
    console.log('Fixing user passwords...')
    
    const users = await prisma.user.findMany()
    
    for (const user of users) {
      // Hash the temp123 password
      const hashedPassword = await hashPassword('temp123')
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      
      console.log(`Updated password for: ${user.email}`)
    }
    
    console.log('✅ All passwords have been hashed successfully!')
    
  } catch (error) {
    console.error('Error fixing passwords:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixPasswords()