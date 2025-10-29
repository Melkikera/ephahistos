export interface Course {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
}

export interface UpdateCourseDTO extends Partial<CreateCourseDTO> {
  id: string;
}