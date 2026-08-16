import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { ChargeRequest, ChargeResult, PaymentProvider } from './payment-provider.interface';
import { FAILURE_REASONS, PaymentMethodToken } from './payment-method-tokens';

const SIMULATED_LATENCY_MS = 600;

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  private readonly logger = new Logger(MockPaymentProvider.name);

  constructor(private readonly config: ConfigService) {}

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    await this.simulateLatency();

    const providerReference = `mock_${randomUUID()}`;
    const failureReason = this.resolveFailureReason(request.paymentMethodToken);

    this.logger.log(
      `Charge ${request.orderReference} for ${request.amountCents} ${request.currency}: ${
        failureReason ? 'declined' : 'approved'
      }`,
    );

    if (failureReason) {
      return { success: false, providerReference, failureReason };
    }

    return { success: true, providerReference };
  }

  private resolveFailureReason(token: string): string | undefined {
    if (token === PaymentMethodToken.SUCCESS) {
      return undefined;
    }

    if (FAILURE_REASONS[token]) {
      return FAILURE_REASONS[token];
    }

    const failureRate = this.config.get<number>('paymentRandomFailureRate') ?? 0;
    return Math.random() < failureRate
      ? 'The payment could not be completed. Please try again.'
      : undefined;
  }

  private simulateLatency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  }
}
