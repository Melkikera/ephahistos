import { NextResponse } from 'next/server';
import { z } from 'zod';

import { RegisterUser } from '../../../../application/usecases/RegisterUser';
import { UserRepositoryPrisma } from '../../../../infrastructure/prisma/UserRepositoryPrisma';

const registerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  dateOfBirth: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const repo = new UserRepositoryPrisma();
    const usecase = new RegisterUser(repo);

    // Convert dateOfBirth string to Date for usecase
    const result = await usecase.execute({
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      dateOfBirth: new Date(parsed.dateOfBirth),
    });

    if (result.errors) {
      return NextResponse.json({ message: 'Invalid input', errors: result.errors }, { status: 400 });
    }

    const { user } = result;
    if (!user) {
      return NextResponse.json({ message: 'Could not create user' }, { status: 500 });
    }

    // hide password if present
    const { password, ...userWithoutPassword } = user as any;

    return NextResponse.json({ user: userWithoutPassword, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input data', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}