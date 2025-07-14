import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@ApiExcludeController()
@Controller('health')
export class HealthCheckController {
  @Get('/')
  healthCheck() {
    return 'OK';
  }
}
