import {
    Controller,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }

    // Logout function: Nothing to clean up in backend for now, only delete jwt in the frontend localStorage
    // @UseGuards(JwtAuthGuard)
    // @Post('/logout')
    // async logout(@Request() req) {
    //   console.log("Logging out");
    //   return this.authService.logout(req.user);
    // }
}
  