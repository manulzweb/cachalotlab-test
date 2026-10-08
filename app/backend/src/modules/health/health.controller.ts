import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Verificar estado de salud del servicio',
    description: 'Devuelve el estado operativo de la API y la conectividad con la base de datos PostgreSQL.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El servicio y la base de datos se encuentran operativos.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        database: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2026-10-07T18:00:00.000Z' },
        uptime: { type: 'number', example: 124.5 },
      },
    },
  })
  check() {
    return this.healthService.check();
  }
}
