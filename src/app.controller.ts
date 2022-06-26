import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
  ) {}

  @Get('/')
  sayHello() {
    return this.appService.getHello();
  }
}