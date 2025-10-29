export type Role = 'ADMIN' | 'PARENT';

export interface User {
  id: string;
  name?: string | null;
  email: string;
  password?: string; // hashed password (optional on read DTOs)
  dateOfBirth: Date;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}
