const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupTestData() {
  try {
    console.log('🚀 Setting up test data...');
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'ADMIN'
      }
    });
    console.log('✅ Test user created:', user.email);
    
    // Create a test board
    const board = await prisma.board.upsert({
      where: { 
        id: 'test-board-1'
      },
      update: {},
      create: {
        id: 'test-board-1',
        name: 'Test Kanban Board',
        description: 'A test board with sample columns and tasks',
        isPublic: true,
        owner: {
          connect: { id: user.id }
        }
      }
    });
    console.log('✅ Test board created:', board.name);
    
    // Create columns for the board
    const columns = [
      { name: 'To Do', color: '#ef4444', position: 0 },
      { name: 'In Progress', color: '#f59e0b', position: 1 },
      { name: 'In Review', color: '#3b82f6', position: 2 },
      { name: 'Done', color: '#10b981', position: 3 }
    ];
    
    for (const col of columns) {
      const column = await prisma.column.upsert({
        where: {
          id: `${board.id}-${col.name.toLowerCase().replace(' ', '-')}`
        },
        update: {},
        create: {
          id: `${board.id}-${col.name.toLowerCase().replace(' ', '-')}`,
          name: col.name,
          color: col.color,
          position: col.position,
          boardId: board.id
        }
      });
      console.log(`  ✅ Column created: ${column.name}`);
      
      // Add sample tasks to each column
      const taskCount = col.position === 0 ? 3 : col.position === 1 ? 2 : 1;
      for (let i = 0; i < taskCount; i++) {
        const task = await prisma.task.create({
          data: {
            title: `${col.name} Task ${i + 1}`,
            description: `This is a sample task in the ${col.name} column`,
            priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
            status: col.position === 0 ? 'TODO' : col.position === 3 ? 'DONE' : 'IN_PROGRESS',
            position: i,
            column: {
              connect: { id: column.id }
            },
            creator: {
              connect: { id: user.id }
            }
          }
        });
        console.log(`    ✅ Task created: ${task.title}`);
      }
    }
    
    console.log('\n✨ Test data setup complete!');
    console.log('📝 You can now login with:');
    console.log('   Email: test@example.com');
    console.log('   Password: testpassword123');
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestData();