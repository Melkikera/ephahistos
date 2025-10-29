import { NextRequest, NextResponse } from 'next/server';
import { CourseRepositoryPrisma } from '@/infrastructure/repositories/CourseRepositoryPrisma';
import {
  CreateCourseUseCase,
  ListCoursesUseCase,
  GetCourseUseCase,
  UpdateCourseUseCase,
  DeleteCourseUseCase,
  EnrollChildUseCase,
  UnenrollChildUseCase
} from '@/application/usecases/course/CourseUseCases';

const courseRepository = new CourseRepositoryPrisma();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const useCase = new GetCourseUseCase(courseRepository);
      const course = await useCase.execute(id);
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json(course);
    } else {
      const useCase = new ListCoursesUseCase(courseRepository);
      const courses = await useCase.execute();
      return NextResponse.json(courses);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new CreateCourseUseCase(courseRepository);
    const course = await useCase.execute({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new UpdateCourseUseCase(courseRepository);
    const course = await useCase.execute({
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined
    });
    return NextResponse.json(course);
  } catch (error: any) {
    if (error.message === 'Course not found') {
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
    const useCase = new DeleteCourseUseCase(courseRepository);
    await useCase.execute(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === 'Course not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Special endpoints for enrollment
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const childId = searchParams.get('childId');
  const action = searchParams.get('action');

  if (!courseId || !childId || !action) {
    return NextResponse.json({ error: 'Course ID, Child ID, and action are required' }, { status: 400 });
  }

  try {
    if (action === 'enroll') {
      const useCase = new EnrollChildUseCase(courseRepository);
      await useCase.execute(courseId, childId);
    } else if (action === 'unenroll') {
      const useCase = new UnenrollChildUseCase(courseRepository);
      await useCase.execute(courseId, childId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === 'Course not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}