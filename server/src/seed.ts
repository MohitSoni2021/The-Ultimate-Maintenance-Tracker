import bcrypt from 'bcryptjs';
import prisma from './utils/prisma.js';

async function main() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gearguard.com' },
    });

    // Create default teams if they don't exist
    const teamNames = ['Mechanical', 'Electrical', 'Facilities', 'IT Support'];
    for (const name of teamNames) {
      await prisma.maintenanceTeam.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log('✅ Default teams ensured');

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@gearguard.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        avatar: null,
      },
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@gearguard.com');
    console.log('Password: admin123');
    console.log('User ID:', admin.id);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
