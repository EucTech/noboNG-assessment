import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Liveness check',
    description: 'Confirms the process is up and that a database round trip succeeds.',
  })
  @ApiOkResponse({
    schema: {
      example: { status: 'ok', timestamp: '2026-08-16T00:48:00.951Z' },
    },
  })
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;

    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
