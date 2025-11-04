import { is } from "zod/locales";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date;
  location: string;
  isDone: boolean;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  id: string;
}