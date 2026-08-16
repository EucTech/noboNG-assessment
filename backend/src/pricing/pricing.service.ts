import { Injectable } from '@nestjs/common';
import {
  CONSOLIDATED_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
} from './pricing.constants';

export interface PriceableLine {
  unitPriceCents: number;
  quantity: number;
}

export interface PriceBreakdown {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

@Injectable()
export class PricingService {
  calculateSubtotal(lines: PriceableLine[]): number {
    return lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  }

  calculateShipping(subtotalCents: number): number {
    if (subtotalCents <= 0) {
      return 0;
    }

    return subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS
      ? STANDARD_SHIPPING_CENTS
      : CONSOLIDATED_SHIPPING_CENTS;
  }

  calculate(lines: PriceableLine[]): PriceBreakdown {
    const subtotalCents = this.calculateSubtotal(lines);
    const shippingCents = this.calculateShipping(subtotalCents);

    return {
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
    };
  }
}
