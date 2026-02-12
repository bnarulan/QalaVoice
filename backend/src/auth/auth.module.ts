import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { EgovModule } from '../egov/egov.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    EgovModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key-change-in-production',
      signOptions: { expiresIn: 604800 }, // 7 days in seconds
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
