import { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/domain/entities/Donation';
import { IDonationRepository } from '@/domain/repositories/IDonationRepository';
import { PrismaRepository } from './PrismaRepository';

export class DonationRepositoryPrisma extends PrismaRepository implements IDonationRepository {
  async create(data: CreateDonationDTO): Promise<Donation> {
    const donation = await this.prisma.donation.create({
      data: {
        ...data,
        status: 'pending'
      }
    });
    
    return {
      ...donation,
      message: donation.message ?? undefined
    };
  }

  async findById(id: string): Promise<Donation | null> {
    const donation = await this.prisma.donation.findUnique({
      where: { id }
    });

    if (!donation) return null;

    return {
      ...donation,
      message: donation.message ?? undefined
    };
  }

  async findAll(): Promise<Donation[]> {
    const donations = await this.prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return donations.map((donation: any) => ({
      ...donation,
      message: donation.message ?? undefined
    }));
  }

  async update(data: UpdateDonationDTO): Promise<Donation> {
    const { id, ...updateData } = data;
    const donation = await this.prisma.donation.update({
      where: { id },
      data: updateData
    });

    return {
      ...donation,
      message: donation.message ?? undefined
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.donation.delete({
      where: { id }
    });
  }
}