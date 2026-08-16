import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

const DESCRIPTION = `
REST API for the NoboNG cross-border commerce journey.

**Product -> Cart -> Checkout -> Simulated Payment -> Order**

Notes for reviewers:

- Money is in **integer minor units**. \`12000\` is \`$120.00\`.
- \`POST /orders\` accepts product ids and quantities only. Prices, subtotal, shipping and
  total are calculated on the server from the database. Sending \`unitPriceCents\` or
  \`totalCents\` is rejected with **400**, not ignored.
- Payments are **simulated**. The outcome is chosen with a test token such as
  \`tok_test_success\` or \`tok_test_declined\`. No card number, CVV or payment credential is
  ever accepted or stored.
- Every attempt carries an idempotency key shaped \`PAY-{orderReference}-{attempt}\`, unique in
  the database. Replaying a settled key returns the stored result without charging again.
- A declined payment never produces a fulfilled order. Retry with
  \`POST /payments/{id}/retry\`.
`;

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NoboNG API')
    .setDescription(DESCRIPTION)
    .setVersion('1.0')
    .addTag('Products', 'Catalogue reads')
    .addTag('Pricing', 'Shipping rules used by the cart estimate')
    .addTag('Orders', 'Order creation and lookup')
    .addTag('Payments', 'Simulated gateway with idempotent attempts')
    .addTag('Health', 'Liveness')
    .addServer('http://localhost:4000', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    jsonDocumentUrl: `${SWAGGER_PATH}/json`,
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      docExpansion: 'list',
    },
    customSiteTitle: 'NoboNG API Reference',
  });
}
