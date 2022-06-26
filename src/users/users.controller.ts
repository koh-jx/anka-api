import {
    Controller,
    Get,
    Post,
    Param,
    Res,
    Req,
    UseGuards,
    Body,
    ForbiddenException,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CardsService } from 'src/cards/cards.service';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
      private readonly cardsService: CardsService,
    ) {}

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
            console.log(error)
            res.status(400).send({ 
                error: "Could not register user",
                error_description: error.message,
            });
        }
    }

    // req.user returns username and id
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
      try {
        const user = await this.usersService.findOneById(req.user.id);
        if (!user) {
          throw new ForbiddenException();
        }
        user.password = undefined;
        const userObj = JSON.parse(JSON.stringify(user));
        return {
          ...userObj,
        };
      } catch (e : any) {
        throw new ForbiddenException(e.message);
      }
    }

    @Get('/exists/:username')
    async getUser(@Param('username') username: string) {
        const result = await this.usersService.findOneByUsername(username);
        return result !== null;
    }
}
  