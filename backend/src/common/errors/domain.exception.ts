import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodeValue } from './error-codes';

export class DomainException extends HttpException {
  readonly code: ErrorCodeValue;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCodeValue,
    message: string,
    status: HttpStatus,
    details?: Record<string, unknown>,
  ) {
    super({ code, message, details }, status);
    this.code = code;
    this.details = details;
  }
}

export class ProductNotFoundException extends DomainException {
  constructor(productId: string) {
    super(
      ErrorCode.PRODUCT_NOT_FOUND,
      'This product is no longer available in our catalogue.',
      HttpStatus.NOT_FOUND,
      { productId },
    );
  }
}

export class ProductUnavailableException extends DomainException {
  constructor(productName: string) {
    super(
      ErrorCode.PRODUCT_UNAVAILABLE,
      `${productName} is currently out of stock and cannot be ordered.`,
      HttpStatus.CONFLICT,
    );
  }
}

export class InsufficientStockException extends DomainException {
  constructor(productName: string, available: number) {
    super(
      ErrorCode.INSUFFICIENT_STOCK,
      `Only ${available} unit(s) of ${productName} are left in stock.`,
      HttpStatus.CONFLICT,
      { available },
    );
  }
}

export class EmptyCartException extends DomainException {
  constructor() {
    super(
      ErrorCode.EMPTY_CART,
      'Your cart is empty. Add at least one product before checking out.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class OrderNotFoundException extends DomainException {
  constructor(orderId: string) {
    super(ErrorCode.ORDER_NOT_FOUND, 'We could not find that order.', HttpStatus.NOT_FOUND, {
      orderId,
    });
  }
}

export class OrderNotPayableException extends DomainException {
  constructor(status: string) {
    super(
      ErrorCode.ORDER_NOT_PAYABLE,
      'This order is no longer awaiting payment.',
      HttpStatus.CONFLICT,
      { status },
    );
  }
}

export class PaymentNotFoundException extends DomainException {
  constructor(paymentId: string) {
    super(ErrorCode.PAYMENT_NOT_FOUND, 'We could not find that payment.', HttpStatus.NOT_FOUND, {
      paymentId,
    });
  }
}

export class PaymentDeclinedException extends DomainException {
  constructor(reason: string, details: Record<string, unknown>) {
    super(ErrorCode.PAYMENT_DECLINED, reason, HttpStatus.PAYMENT_REQUIRED, details);
  }
}

export class PaymentInProgressException extends DomainException {
  constructor(idempotencyKey: string) {
    super(
      ErrorCode.PAYMENT_IN_PROGRESS,
      'A payment with this reference is still being processed.',
      HttpStatus.CONFLICT,
      { idempotencyKey },
    );
  }
}
