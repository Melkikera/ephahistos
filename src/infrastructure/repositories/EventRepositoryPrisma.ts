import { Event, CreateEventDTO, UpdateEventDTO } from '@/domain/entities/Event';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { PrismaRepository } from './PrismaRepository';

export class EventRepositoryPrisma extends PrismaRepository implements IEventRepository {
  async create(data: CreateEventDTO): Promise<Event> {
    return this.prisma.event.create({
      data
    });
  }

  async findById(id: string): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id }
    });
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
  }

  async update(data: UpdateEventDTO): Promise<Event> {
    const { id, ...updateData } = data;
    return this.prisma.event.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id }
    });
  }
}