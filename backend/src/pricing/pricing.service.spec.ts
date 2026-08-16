import { PricingService } from './pricing.service';
import {
  CONSOLIDATED_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
} from './pricing.constants';

describe('PricingService', () => {
  let pricing: PricingService;

  beforeEach(() => {
    pricing = new PricingService();
  });

  describe('calculateSubtotal', () => {
    it('multiplies unit price by quantity across every line', () => {
      const subtotal = pricing.calculateSubtotal([
        { unitPriceCents: 12_000, quantity: 2 },
        { unitPriceCents: 9_995, quantity: 3 },
      ]);

      expect(subtotal).toBe(53_985);
    });

    it('returns zero for an empty basket', () => {
      expect(pricing.calculateSubtotal([])).toBe(0);
    });
  });

  describe('calculateShipping', () => {
    it('charges nothing when there is nothing to ship', () => {
      expect(pricing.calculateShipping(0)).toBe(0);
    });

    it('charges the standard rate below the threshold', () => {
      expect(pricing.calculateShipping(FREE_SHIPPING_THRESHOLD_CENTS - 1)).toBe(
        STANDARD_SHIPPING_CENTS,
      );
    });

    it('charges the consolidated rate at the threshold', () => {
      expect(pricing.calculateShipping(FREE_SHIPPING_THRESHOLD_CENTS)).toBe(
        CONSOLIDATED_SHIPPING_CENTS,
      );
    });

    it('charges the consolidated rate above the threshold', () => {
      expect(pricing.calculateShipping(250_000)).toBe(CONSOLIDATED_SHIPPING_CENTS);
    });
  });

  describe('calculate', () => {
    it('returns a breakdown where total is subtotal plus shipping', () => {
      const breakdown = pricing.calculate([{ unitPriceCents: 12_000, quantity: 2 }]);

      expect(breakdown).toEqual({
        subtotalCents: 24_000,
        shippingCents: CONSOLIDATED_SHIPPING_CENTS,
        totalCents: 24_000 + CONSOLIDATED_SHIPPING_CENTS,
      });
    });

    it('applies the standard rate to a small basket', () => {
      const breakdown = pricing.calculate([{ unitPriceCents: 7_900, quantity: 1 }]);

      expect(breakdown).toEqual({
        subtotalCents: 7_900,
        shippingCents: STANDARD_SHIPPING_CENTS,
        totalCents: 7_900 + STANDARD_SHIPPING_CENTS,
      });
    });

    it('never charges shipping on an empty basket', () => {
      expect(pricing.calculate([])).toEqual({
        subtotalCents: 0,
        shippingCents: 0,
        totalCents: 0,
      });
    });
  });
});
