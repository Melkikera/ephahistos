import { Course, CreateCourseDTO, UpdateCourseDTO } from '@/domain/entities/Course';
import { ICourseRepository } from '@/domain/repositories/ICourseRepository';

export class CreateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(data: CreateCourseDTO): Promise<Course> {
    return this.courseRepository.create(data);
  }
}

export class GetCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<Course | null> {
    return this.courseRepository.findById(id);
  }
}

export class ListCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }
}

export class UpdateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(data: UpdateCourseDTO): Promise<Course> {
    const course = await this.courseRepository.findById(data.id);
    if (!course) {
      throw new Error('Course not found');
    }
    return this.courseRepository.update(data);
  }
}

export class DeleteCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<void> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    await this.courseRepository.delete(id);
  }
}

export class EnrollChildUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(courseId: string, childId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    await this.courseRepository.enrollChild(courseId, childId);
  }
}

export class UnenrollChildUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(courseId: string, childId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    await this.courseRepository.unenrollChild(courseId, childId);
  }
}