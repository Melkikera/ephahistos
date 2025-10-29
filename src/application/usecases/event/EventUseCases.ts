import { Event, CreateEventDTO, UpdateEventDTO } from '@/domain/entities/Event';
import { IEventRepository } from '@/domain/repositories/IEventRepository';

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(data: CreateEventDTO): Promise<Event> {
    return this.eventRepository.create(data);
  }
}

export class GetEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<Event | null> {
    return this.eventRepository.findById(id);
  }
}

export class ListEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(data: UpdateEventDTO): Promise<Event> {
    const event = await this.eventRepository.findById(data.id);
    if (!event) {
      throw new Error('Event not found');
    }
    return this.eventRepository.update(data);
  }
}

export class DeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    await this.eventRepository.delete(id);
  }
}