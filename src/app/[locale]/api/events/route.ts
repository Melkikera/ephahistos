import { NextRequest, NextResponse } from 'next/server';
import { EventRepositoryPrisma } from '@/infrastructure/repositories/EventRepositoryPrisma';
import { 
  CreateEventUseCase,
  ListEventsUseCase,
  GetEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase
} from '@/application/usecases/event/EventUseCases';

const eventRepository = new EventRepositoryPrisma();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const useCase = new GetEventUseCase(eventRepository);
      const event = await useCase.execute(id);
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json(event);
    } else {
      const useCase = new ListEventsUseCase(eventRepository);
      const events = await useCase.execute();
      return NextResponse.json(events);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new CreateEventUseCase(eventRepository);
    const event = await useCase.execute({
      ...data,
      date: new Date(data.date)
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new UpdateEventUseCase(eventRepository);
    const event = await useCase.execute({
      ...data,
      date: data.date ? new Date(data.date) : undefined
    });
    return NextResponse.json(event);
  } catch (error: any) {
    if (error.message === 'Event not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const useCase = new DeleteEventUseCase(eventRepository);
    await useCase.execute(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === 'Event not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}