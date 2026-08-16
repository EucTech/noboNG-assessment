import { PrismaService } from '../database/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ShipmentsService } from '../shipments/shipments.service';
import {
  OrderNotFoundException,
  OrderNotPayableException,
  PaymentDeclinedException,
  PaymentInProgressException,
} from '../common/errors/domain.exception';
import { PaymentsService } from './payments.service';
import { PaymentMethodToken } from './providers/payment-method-tokens';
import type { ChargeResult, PaymentProvider } from './providers/payment-provider.interface';

const ORDER = {
  id: 'order_1',
  reference: 'NBO-10001',
  status: 'PENDING_PAYMENT',
  totalCents: 26_500,
  currency: 'USD',
};

const KEY = 'PAY-NBO-10001-001';

function buildHarness(charge: ChargeResult) {
  const tx = {
    payment: {
      update: jest.fn().mockImplementation(({ data }) => ({
        id: 'pay_1',
        orderId: ORDER.id,
        idempotencyKey: KEY,
        attempt: 1,
        amountCents: ORDER.totalCents,
        currency: ORDER.currency,
        ...data,
      })),
    },
  };

  const prisma = {
    payment: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'pay_1', attempt: 1, idempotencyKey: KEY }),
      count: jest.fn().mockResolvedValue(1),
    },
    order: { findUnique: jest.fn().mockResolvedValue(ORDER) },
    $transaction: jest.fn().mockImplementation((callback) => callback(tx)),
  } as unknown as PrismaService;

  const orders = {
    markPaid: jest.fn(),
    markProcessing: jest.fn(),
    markPaymentFailed: jest.fn(),
    reserveStock: jest.fn(),
    findById: jest.fn().mockResolvedValue({ ...ORDER, status: 'PROCESSING' }),
  } as unknown as OrdersService;

  const shipments = { createForOrder: jest.fn() } as unknown as ShipmentsService;

  const provider: PaymentProvider = {
    name: 'mock',
    charge: jest.fn().mockResolvedValue(charge),
  };

  const service = new PaymentsService(prisma, orders, shipments, provider);

  return { service, prisma, orders, shipments, provider };
}

const APPROVED: ChargeResult = { success: true, providerReference: 'mock_ok' };
const DECLINED: ChargeResult = {
  success: false,
  providerReference: 'mock_no',
  failureReason: 'The card was declined by the issuing bank.',
};

function request(overrides: Partial<Parameters<PaymentsService['process']>[0]> = {}) {
  return {
    orderId: ORDER.id,
    idempotencyKey: KEY,
    paymentMethodToken: PaymentMethodToken.SUCCESS,
    ...overrides,
  };
}

describe('PaymentsService.process on success', () => {
  it('charges the amount stored on the order, not one supplied by the caller', async () => {
    const { service, provider } = buildHarness(APPROVED);

    await service.process(request());

    expect(provider.charge).toHaveBeenCalledWith(
      expect.objectContaining({ amountCents: ORDER.totalCents, currency: 'USD' }),
    );
  });

  it('moves the order through PAID into PROCESSING and opens a shipment', async () => {
    const { service, orders, shipments } = buildHarness(APPROVED);

    await service.process(request());

    expect(orders.markPaid).toHaveBeenCalledWith(expect.anything(), ORDER.id);
    expect(orders.reserveStock).toHaveBeenCalledWith(expect.anything(), ORDER.id);
    expect(shipments.createForOrder).toHaveBeenCalledWith(expect.anything(), ORDER.id);
    expect(orders.markProcessing).toHaveBeenCalledWith(expect.anything(), ORDER.id);
  });

  it('records the payment as SUCCEEDED', async () => {
    const { service } = buildHarness(APPROVED);

    const result = await service.process(request());

    expect(result.payment.status).toBe('SUCCEEDED');
    expect(result.replayed).toBe(false);
  });
});

describe('PaymentsService.process on failure', () => {
  it('declines with a retryable error and never fulfils the order', async () => {
    const { service, orders, shipments } = buildHarness(DECLINED);

    await expect(service.process(request())).rejects.toBeInstanceOf(PaymentDeclinedException);

    expect(orders.markPaymentFailed).toHaveBeenCalledWith(expect.anything(), ORDER.id);
    expect(orders.markPaid).not.toHaveBeenCalled();
    expect(orders.markProcessing).not.toHaveBeenCalled();
    expect(shipments.createForOrder).not.toHaveBeenCalled();
  });

  it('tells the caller which idempotency key to use for the next attempt', async () => {
    const { service } = buildHarness(DECLINED);

    await expect(service.process(request())).rejects.toMatchObject({
      details: expect.objectContaining({ nextIdempotencyKey: 'PAY-NBO-10001-002' }),
    });
  });
});

describe('PaymentsService idempotency', () => {
  it('replays a stored success instead of charging again', async () => {
    const { service, prisma, provider } = buildHarness(APPROVED);

    (prisma.payment.findUnique as jest.Mock).mockResolvedValue({
      id: 'pay_1',
      orderId: ORDER.id,
      idempotencyKey: KEY,
      attempt: 1,
      status: 'SUCCEEDED',
      amountCents: ORDER.totalCents,
      order: { ...ORDER, status: 'PROCESSING' },
    });

    const result = await service.process(
      request({ paymentMethodToken: PaymentMethodToken.DECLINED }),
    );

    expect(result.replayed).toBe(true);
    expect(result.payment.status).toBe('SUCCEEDED');
    expect(provider.charge).not.toHaveBeenCalled();
    expect(prisma.payment.create).not.toHaveBeenCalled();
  });

  it('replays a stored failure instead of charging again', async () => {
    const { service, prisma, provider } = buildHarness(APPROVED);

    (prisma.payment.findUnique as jest.Mock).mockResolvedValue({
      id: 'pay_1',
      orderId: ORDER.id,
      idempotencyKey: KEY,
      attempt: 1,
      status: 'FAILED',
      failureReason: 'The card was declined by the issuing bank.',
      order: ORDER,
    });

    await expect(service.process(request())).rejects.toMatchObject({
      details: expect.objectContaining({ replayed: true }),
    });

    expect(provider.charge).not.toHaveBeenCalled();
  });

  it('refuses to run a second charge while the first is still in flight', async () => {
    const { service, prisma } = buildHarness(APPROVED);

    (prisma.payment.findUnique as jest.Mock).mockResolvedValue({
      id: 'pay_1',
      status: 'PENDING',
      order: ORDER,
    });

    await expect(service.process(request())).rejects.toBeInstanceOf(PaymentInProgressException);
  });

  it('falls back to the stored result when the unique index rejects a racing insert', async () => {
    const { service, prisma, provider } = buildHarness(APPROVED);

    const conflict = Object.assign(new Error('unique'), {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
    });

    (prisma.payment.create as jest.Mock).mockRejectedValue(conflict);
    (prisma.payment.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 'pay_1',
      orderId: ORDER.id,
      idempotencyKey: KEY,
      attempt: 1,
      status: 'SUCCEEDED',
      order: { ...ORDER, status: 'PROCESSING' },
    });

    const result = await service.process(request());

    expect(result.replayed).toBe(true);
    expect(provider.charge).not.toHaveBeenCalled();
  });
});

describe('PaymentsService guards', () => {
  it('rejects payment for an unknown order', async () => {
    const { service, prisma } = buildHarness(APPROVED);
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.process(request())).rejects.toBeInstanceOf(OrderNotFoundException);
  });

  it('rejects payment for an order that is already being fulfilled', async () => {
    const { service, prisma } = buildHarness(APPROVED);
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      ...ORDER,
      status: 'PROCESSING',
    });

    await expect(service.process(request())).rejects.toBeInstanceOf(OrderNotPayableException);
  });

  it('rejects an idempotency key that belongs to a different order', async () => {
    const { service } = buildHarness(APPROVED);

    await expect(
      service.process(request({ idempotencyKey: 'PAY-NBO-99999-001' })),
    ).rejects.toBeInstanceOf(OrderNotPayableException);
  });
});

describe('PaymentsService.buildIdempotencyKey', () => {
  it('pads the attempt number to three digits', () => {
    const { service } = buildHarness(APPROVED);

    expect(service.buildIdempotencyKey('NBO-10001', 1)).toBe('PAY-NBO-10001-001');
    expect(service.buildIdempotencyKey('NBO-10001', 12)).toBe('PAY-NBO-10001-012');
  });
});
