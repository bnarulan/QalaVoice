import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { iin: '000000000001', fullName: 'Администратор', password: hash, role: 'ADMIN' },
    });
    console.log('Created default admin: IIN 000000000001, password admin123');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
