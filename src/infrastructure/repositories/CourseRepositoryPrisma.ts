import { Course, CreateCourseDTO, UpdateCourseDTO } from '@/domain/entities/Course';
import { ICourseRepository } from '@/domain/repositories/ICourseRepository';
import { PrismaRepository } from './PrismaRepository';

export class CourseRepositoryPrisma extends PrismaRepository implements ICourseRepository {
  async create(data: CreateCourseDTO): Promise<Course> {
    return this.prisma.course.create({
      data
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        children: true
      }
    });
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        children: true
      }
    });
  }

  async update(data: UpdateCourseDTO): Promise<Course> {
    const { id, ...updateData } = data;
    return this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        children: true
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id }
    });
  }

  async enrollChild(courseId: string, childId: string): Promise<void> {
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        children: {
          connect: { id: childId }
        }
      }
    });
  }

  async unenrollChild(courseId: string, childId: string): Promise<void> {
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        children: {
          disconnect: { id: childId }
        }
      }
    });
  }
}