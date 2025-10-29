import { Course, CreateCourseDTO, UpdateCourseDTO } from '../entities/Course';

export interface ICourseRepository {
  create(data: CreateCourseDTO): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  update(data: UpdateCourseDTO): Promise<Course>;
  delete(id: string): Promise<void>;
  enrollChild(courseId: string, childId: string): Promise<void>;
  unenrollChild(courseId: string, childId: string): Promise<void>;
}