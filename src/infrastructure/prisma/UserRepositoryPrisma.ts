import { PrismaClient } from '@prisma/client';
import { IUserRepository, CreateUserDTO } from '../../domain/repositories/IUserRepository';
import { User as DomainUser } from '../../domain/entities/User';

const prisma = new PrismaClient();

export class UserRepositoryPrisma implements IUserRepository {
  async findByEmail(email: string): Promise<DomainUser | null> {
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      dateOfBirth: u.dateOfBirth,
      role: u.role as DomainUser['role'],
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  async create(data: CreateUserDTO): Promise<DomainUser> {
    const u = await prisma.user.create({
      data: {
        name: data.name as any,
        email: data.email,
        password: data.passwordHash,
        dateOfBirth: data.dateOfBirth,
        role: data.role ?? 'PARENT',
      },
    });

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      dateOfBirth: u.dateOfBirth,
      role: u.role as DomainUser['role'],
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}
