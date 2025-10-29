export interface Donation {
  id: string;
  amount: number;
  currency: string;
  status: string;
  donorName: string;
  email: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDonationDTO {
  amount: number;
  currency: string;
  donorName: string;
  email: string;
  message?: string;
}

export interface UpdateDonationDTO extends Partial<CreateDonationDTO> {
  id: string;
  status?: string;
}