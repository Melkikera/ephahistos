export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date;
  location: string;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  id: string;
}