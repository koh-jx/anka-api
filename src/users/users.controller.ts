import {
    Controller,
    Get,
    Post,
    Param,
    Res,
    UseGuards,
    Body,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Register a new user
    @Post('/register')
    async register(
        @Res() res,
        @Body('username') username: string,
        @Body('password') password: string,
    ) {
        try {
            await this.usersService.register(username, password);
            res.status(201).send();
        } catch (error: any) {
            res.status(400).send({ 
                error: "Could not register user",
                error_description: error.message,
            });
        }
    }


}
  