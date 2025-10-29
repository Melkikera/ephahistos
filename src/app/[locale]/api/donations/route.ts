import { NextRequest, NextResponse } from 'next/server';
import { DonationRepositoryPrisma } from '@/infrastructure/repositories/DonationRepositoryPrisma';
import {
  CreateDonationUseCase,
  ListDonationsUseCase,
  GetDonationUseCase,
  UpdateDonationUseCase,
  DeleteDonationUseCase
} from '@/application/usecases/donation/DonationUseCases';

const donationRepository = new DonationRepositoryPrisma();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const useCase = new GetDonationUseCase(donationRepository);
      const donation = await useCase.execute(id);
      if (!donation) {
        return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
      }
      return NextResponse.json(donation);
    } else {
      const useCase = new ListDonationsUseCase(donationRepository);
      const donations = await useCase.execute();
      return NextResponse.json(donations);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new CreateDonationUseCase(donationRepository);
    const donation = await useCase.execute(data);
    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new UpdateDonationUseCase(donationRepository);
    const donation = await useCase.execute(data);
    return NextResponse.json(donation);
  } catch (error: any) {
    if (error.message === 'Donation not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const useCase = new DeleteDonationUseCase(donationRepository);
    await useCase.execute(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === 'Donation not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}