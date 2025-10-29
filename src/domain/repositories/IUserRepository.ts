import { User } from "../entities/User";

export type CreateUserDTO = {
  name?: string | null;
  email: string;
  passwordHash: string;
  dateOfBirth: Date;
  role?: User['role'];
};

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
}
