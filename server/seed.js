import bcrypt from 'bcryptjs';
import prisma from './src/utils/prisma.js';
async function main() {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@gearguard.com' },
        });
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
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=seed.js.map