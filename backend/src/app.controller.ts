import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return 'Hello from backend!';
  }
  @Get('data')
  getData(): string {
    return 'Get-Data-from-backend';
  }
}
