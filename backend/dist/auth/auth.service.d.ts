import { PrismaService } from '../prisma/prisma.service';
import { EgovService } from '../egov/egov.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwt;
    private egov;
    constructor(prisma: PrismaService, jwt: JwtService, egov: EgovService);
    register(iin: string, fullName: string, password: string, adminUserId: number, role?: string, sphere?: string): Promise<{
        access_token: string;
    }>;
    login(iin: string, password: string): Promise<{
        access_token: string;
    }>;
    private sign;
    getProfile(userId: number): Promise<{
        fullName: string;
        id: number;
        iin: string;
        address: string;
        role: string;
    }>;
}
