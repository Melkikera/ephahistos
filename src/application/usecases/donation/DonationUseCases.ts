import { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/domain/entities/Donation';
import { IDonationRepository } from '@/domain/repositories/IDonationRepository';

export class CreateDonationUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(data: CreateDonationDTO): Promise<Donation> {
    return this.donationRepository.create(data);
  }
}

export class GetDonationUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(id: string): Promise<Donation | null> {
    return this.donationRepository.findById(id);
  }
}

export class ListDonationsUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(): Promise<Donation[]> {
    return this.donationRepository.findAll();
  }
}

export class UpdateDonationUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(data: UpdateDonationDTO): Promise<Donation> {
    const donation = await this.donationRepository.findById(data.id);
    if (!donation) {
      throw new Error('Donation not found');
    }
    return this.donationRepository.update(data);
  }
}

export class DeleteDonationUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(id: string): Promise<void> {
    const donation = await this.donationRepository.findById(id);
    if (!donation) {
      throw new Error('Donation not found');
    }
    await this.donationRepository.delete(id);
  }
}