import { Event, CreateEventDTO, UpdateEventDTO } from '../entities/Event';

export interface IEventRepository {
  create(data: CreateEventDTO): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  update(data: UpdateEventDTO): Promise<Event>;
  delete(id: string): Promise<void>;
}