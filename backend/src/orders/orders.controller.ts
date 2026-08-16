import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequest, ApiConflict, ApiNotFound } from '../common/docs/api-error.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { OrderEntity, OrderSummaryEntity } from './entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an order awaiting payment',
    description:
      'Validates the customer and every product, reads prices from the database, calculates subtotal, shipping and total on the server, and creates the order in PENDING_PAYMENT. Totals sent by the client are rejected, never trusted.',
  })
  @ApiCreatedResponse({ type: OrderEntity })
  @ApiBadRequest(
    'The customer details are invalid, the cart is empty, or an unknown property such as totalCents was sent.',
  )
  @ApiNotFound('One of the product ids is not in the catalogue.')
  @ApiConflict('A product is out of stock, or the requested quantity exceeds the stock on hand.')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List orders for an email',
    description:
      'Returns every order placed with the given email, most recent first. Guest checkout has no login, so the email is the only credential this endpoint checks - do not expose it to anyone other than the address owner.',
  })
  @ApiOkResponse({ type: [OrderSummaryEntity] })
  findByEmail(@Query() query: FindOrdersQueryDto) {
    return this.ordersService.findByEmail(query.email);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an order',
    description:
      'Accepts either the internal id or the customer facing reference such as NBO-10001.',
  })
  @ApiParam({ name: 'id', example: 'NBO-10001' })
  @ApiOkResponse({ type: OrderEntity })
  @ApiNotFound('No order matches that id or reference.')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }
}
