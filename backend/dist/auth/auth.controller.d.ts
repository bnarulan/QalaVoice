import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    profile(req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        fullName: string;
        id: number;
        iin: string;
        address: string;
        role: string;
    }>;
}
