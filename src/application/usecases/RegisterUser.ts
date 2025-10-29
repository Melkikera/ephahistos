import { z } from 'zod';
import { IUserRepository, CreateUserDTO } from '../../domain/repositories/IUserRepository';
import { hash } from 'bcryptjs';
import { User } from '../../domain/entities/User';

const RegisterSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  dateOfBirth: z.date(),
});

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: unknown): Promise<{ user?: User; errors?: any }>{
    const parsed = RegisterSchema.safeParse(input);
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }

    const { name, email, password, dateOfBirth } = parsed.data;

    // Enforce parent registration: registrant must be at least 18 years old
    const now = new Date();
    const adultCutoff = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    // If dateOfBirth is after the cutoff, the person is younger than 18
    if (dateOfBirth > adultCutoff) {
      return { errors: { dateOfBirth: ['Registrant must be at least 18 years old'] } };
    }

    // Prevent duplicate emails
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      return { errors: { email: ['Email already in use'] } };
    }

    const passwordHash = await hash(password, 12);

    const dto: CreateUserDTO = {
      name: name ?? null,
      email,
      passwordHash,
      dateOfBirth,
      role: 'PARENT',
    };

    const user = await this.userRepo.create(dto);

    return { user };
  }
}
