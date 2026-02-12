"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=seed.js.map