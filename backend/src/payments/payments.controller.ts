import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiBadRequest,
  ApiConflict,
  ApiNotFound,
  ApiPaymentRequired,
} from '../common/docs/api-error.decorator';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RetryPaymentDto } from './dto/retry-payment.dto';
import { PaymentResultEntity } from './entities/payment-result.entity';
import { PAYMENT_METHOD_TOKENS } from './providers/payment-method-tokens';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('methods')
  @ApiOperation({
    summary: 'List the simulation tokens',
    description:
      'The mock gateway selects its outcome from a token instead of card data, so both success and failure can be triggered predictably.',
  })
  @ApiOkResponse({ type: [String] })
  getMethods() {
    return PAYMENT_METHOD_TOKENS;
  }

  @Post()
  @ApiOperation({
    summary: 'Process a payment attempt',
    description:
      'Charges the amount stored on the order. If the idempotency key has already settled, the stored result is returned and the provider is never called again. Success promotes the order to PAID then PROCESSING and opens a shipment; failure leaves the order retryable.',
  })
  @ApiCreatedResponse({ type: PaymentResultEntity })
  @ApiBadRequest('The idempotency key or the simulation token is malformed.')
  @ApiPaymentRequired(
    'The payment was declined. details carries paymentId, attempt and nextIdempotencyKey so the client can retry.',
  )
  @ApiNotFound('No order matches that id.')
  @ApiConflict(
    'The order is no longer awaiting payment, or a payment for this key is still in flight.',
  )
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.process(dto);
  }

  @Post(':id/retry')
  @ApiOperation({
    summary: 'Retry a declined payment',
    description:
      'Starts a fresh attempt against the same order with a server-generated idempotency key, so a retry can never replay the failed charge.',
  })
  @ApiParam({ name: 'id', description: 'The id of the payment that was declined.' })
  @ApiCreatedResponse({ type: PaymentResultEntity })
  @ApiPaymentRequired('The retry was also declined.')
  @ApiNotFound('No payment or order matches that id.')
  @ApiConflict('The order is no longer awaiting payment.')
  retry(@Param('id') id: string, @Body() dto: RetryPaymentDto) {
    return this.paymentsService.retry(id, dto);
  }
}
