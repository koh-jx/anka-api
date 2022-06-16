import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {

  @UseGuards(AuthGuard(LocalAuthGuard))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}