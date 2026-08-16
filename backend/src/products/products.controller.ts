import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiNotFound } from '../common/docs/api-error.decorator';
import { ProductsService } from './products.service';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ProductEntity } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List products',
    description: 'Returns the seeded catalogue, optionally searched, filtered and sorted.',
  })
  @ApiOkResponse({ type: [ProductEntity] })
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({
    summary: 'List distinct categories',
    description: 'Backs the category filter so the frontend never hardcodes the list.',
  })
  @ApiOkResponse({ type: [String] })
  findCategories() {
    return this.productsService.findCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product' })
  @ApiParam({ name: 'id', example: 'cmsv32ods00003s7d0ksawz95' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFound('The product is not in the catalogue.')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }
}
