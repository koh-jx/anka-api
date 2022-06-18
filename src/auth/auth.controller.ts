import {
    Controller,
    Get,
    Post,
    Param,
    Res,
    Request,
    UseGuards,
    Body,
} from '@nestjs/common';

import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }
}
  