import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CONSOLIDATED_SHIPPING_CENTS,
  CURRENCY,
  FREE_SHIPPING_THRESHOLD_CENTS,
  MAX_QUANTITY_PER_ITEM,
  STANDARD_SHIPPING_CENTS,
} from './pricing.constants';
import { PricingRulesEntity } from './entities/pricing-rules.entity';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  @Get('rules')
  @ApiOperation({
    summary: 'Get the shipping rules',
    description:
      'Lets the cart show an estimate without hardcoding the rule. The order total is still calculated and locked by the server at checkout.',
  })
  @ApiOkResponse({ type: PricingRulesEntity })
  getRules(): PricingRulesEntity {
    return {
      currency: CURRENCY,
      shippingThresholdCents: FREE_SHIPPING_THRESHOLD_CENTS,
      standardShippingCents: STANDARD_SHIPPING_CENTS,
      consolidatedShippingCents: CONSOLIDATED_SHIPPING_CENTS,
      maxQuantityPerItem: MAX_QUANTITY_PER_ITEM,
    };
  }
}
