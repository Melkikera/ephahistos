import { Donation, CreateDonationDTO, UpdateDonationDTO } from '../entities/Donation';

export interface IDonationRepository {
  create(data: CreateDonationDTO): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  findAll(): Promise<Donation[]>;
  update(data: UpdateDonationDTO): Promise<Donation>;
  delete(id: string): Promise<void>;
}