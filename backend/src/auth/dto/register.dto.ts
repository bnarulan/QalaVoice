export class RegisterDto {
  iin: string;
  fullName: string;
  password: string;
  role?: string; // RESIDENT | EXECUTOR - only admin can set
  sphere?: string; // for EXECUTOR
}
