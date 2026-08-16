import { CustomersService } from '../customers/customers.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../database/prisma.service';
import {
  InsufficientStockException,
  OrderNotFoundException,
  ProductNotFoundException,
  ProductUnavailableException,
} from '../common/errors/domain.exception';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

const CUSTOMER = {
  name: 'Uche Ezeibe',
  email: 'uche@example.com',
  phone: '+2348012345678',
  addressLine: '12 Adeola Odeku Street',
  city: 'Lagos',
  state: 'Lagos',
};

const SNEAKER = {
  id: 'prod_sneaker',
  name: 'Nike Air Max 270',
  imageUrl: 'https://images.example/sneaker.jpg',
  priceCents: 12_000,
  availability: 'IN_STOCK',
  stockQuantity: 10,
};

function buildHarness(products: unknown[]) {
  const tx = {
    product: { findMany: jest.fn().mockResolvedValue(products) },
    order: { create: jest.fn().mockImplementation(({ data }) => ({ id: 'order_1', ...data })) },
    $queryRaw: jest.fn().mockResolvedValue([{ nextval: BigInt(10001) }]),
  };

  const prisma = {
    $transaction: jest.fn().mockImplementation((callback) => callback(tx)),
    order: { findFirst: jest.fn() },
  } as unknown as PrismaService;

  const customers = {
    upsertFromCheckout: jest.fn().mockResolvedValue({ id: 'cust_1' }),
  } as unknown as CustomersService;

  const service = new OrdersService(prisma, customers, new PricingService());

  return { service, prisma, tx };
}

function dto(items: CreateOrderDto['items']): CreateOrderDto {
  return { items, customer: CUSTOMER };
}

describe('OrdersService.create', () => {
  it('prices the order from database values and ignores anything the client sends', async () => {
    const { service, tx } = buildHarness([SNEAKER]);

    await service.create(
      dto([
        {
          productId: SNEAKER.id,
          quantity: 2,
          unitPriceCents: 1,
          totalCents: 1,
        } as CreateOrderDto['items'][number],
      ]),
    );

    const created = tx.order.create.mock.calls[0][0].data;

    expect(created.subtotalCents).toBe(24_000);
    expect(created.shippingCents).toBe(2_500);
    expect(created.totalCents).toBe(26_500);
    expect(created.items.createMany.data[0].unitPriceCents).toBe(SNEAKER.priceCents);
  });

  it('stores the price paid on the order item so later price changes do not rewrite history', async () => {
    const { service, tx } = buildHarness([SNEAKER]);

    await service.create(dto([{ productId: SNEAKER.id, quantity: 1 }]));

    expect(tx.order.create.mock.calls[0][0].data.items.createMany.data[0]).toMatchObject({
      productId: SNEAKER.id,
      productName: SNEAKER.name,
      quantity: 1,
      unitPriceCents: 12_000,
      lineTotalCents: 12_000,
    });
  });

  it('creates the order in PENDING_PAYMENT with a sequential reference', async () => {
    const { service, tx } = buildHarness([SNEAKER]);

    await service.create(dto([{ productId: SNEAKER.id, quantity: 1 }]));

    const created = tx.order.create.mock.calls[0][0].data;

    expect(created.status).toBe('PENDING_PAYMENT');
    expect(created.reference).toBe('NBO-10001');
  });

  it('merges duplicate lines for the same product', async () => {
    const { service, tx } = buildHarness([SNEAKER]);

    await service.create(
      dto([
        { productId: SNEAKER.id, quantity: 2 },
        { productId: SNEAKER.id, quantity: 3 },
      ]),
    );

    const lines = tx.order.create.mock.calls[0][0].data.items.createMany.data;

    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(5);
  });

  it('rejects a product that is not in the catalogue', async () => {
    const { service } = buildHarness([]);

    await expect(
      service.create(dto([{ productId: 'prod_missing', quantity: 1 }])),
    ).rejects.toBeInstanceOf(ProductNotFoundException);
  });

  it('rejects an out of stock product', async () => {
    const { service } = buildHarness([
      { ...SNEAKER, availability: 'OUT_OF_STOCK', stockQuantity: 0 },
    ]);

    await expect(
      service.create(dto([{ productId: SNEAKER.id, quantity: 1 }])),
    ).rejects.toBeInstanceOf(ProductUnavailableException);
  });

  it('rejects a quantity larger than the stock on hand', async () => {
    const { service } = buildHarness([{ ...SNEAKER, stockQuantity: 2 }]);

    await expect(
      service.create(dto([{ productId: SNEAKER.id, quantity: 5 }])),
    ).rejects.toBeInstanceOf(InsufficientStockException);
  });
});

describe('OrdersService.findById', () => {
  it('raises a domain error when the order does not exist', async () => {
    const { service, prisma } = buildHarness([]);
    (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.findById('order_missing')).rejects.toBeInstanceOf(OrderNotFoundException);
  });

  it('accepts either the internal id or the customer facing reference', async () => {
    const { service, prisma } = buildHarness([]);
    (prisma.order.findFirst as jest.Mock).mockResolvedValue({ id: 'order_1' });

    await service.findById('NBO-10001');

    expect((prisma.order.findFirst as jest.Mock).mock.calls[0][0].where).toEqual({
      OR: [{ id: 'NBO-10001' }, { reference: 'NBO-10001' }],
    });
  });
});
