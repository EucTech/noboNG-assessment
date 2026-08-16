import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '../database/prisma-client';
import { CustomerDetailsDto } from './dto/customer-details.dto';

type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class CustomersService {
  async upsertFromCheckout(tx: TransactionClient, details: CustomerDetailsDto): Promise<Customer> {
    const data = {
      name: details.name,
      phone: details.phone,
      addressLine: details.addressLine,
      city: details.city,
      state: details.state,
      country: details.country ?? 'Nigeria',
    };

    return tx.customer.upsert({
      where: { email: details.email },
      create: { email: details.email, ...data },
      update: data,
    });
  }
}
