import {
    Controller,
    Delete,
    Get,
    Post,
    Param,
    Res,
    Req,
    Patch,
    UseGuards,
    Body,
    Query,
    ForbiddenException,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
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
            res.status(400).send({ 
                error: "Could not register user",
                error_description: error.message,
            });
        }
    }

    // Check if a user exists, for registration of new user
    @Get('/exists/:username')
    async getUser(@Param('username') username: string) {
        const result = await this.usersService.findOneByUsername(username);
        return result !== null;
    }

    // Get the profile of the user
    // req.user returns username and id
    @UseGuards(JwtAuthGuard)
    @Get('/profile')
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

    //// For future use, where user can possibly opt to add other users' cards to their own collection

    // // Add a card id into the owner's deck
    // // Patch request to edit the users' array to append into it
    // @UseGuards(JwtAuthGuard)
    // @Patch('/card')
    // async addCard(
    //   @Req() req,
    //   @Res() res,
    //   @Body('id') id: string,
    // ) {
    //   try {
    //     const userId = req.user.id;
    //     const deck = await this.usersService.addCard(userId, id);
    //     res.status(200).send(deck);
    //   } catch (error : any) {
    //     res.status(400).send({ error: "Bad request", error_description: error.message });
    //   }
    // }

    // // Delete a single card from the owner's deck
    // @UseGuards(JwtAuthGuard)
    // @Delete('/card')
    // async deleteCard(
    //   @Req() req,
    //   @Res() res,
    //   @Query('id') id: string,
    // ) {
    //   try {
    //     const userId = req.user.id;
    //     const deck = await this.usersService.removeCard(userId, id);
    //     res.status(200).send(deck);
    //   } catch (error : any) {
    //     res.status(400).send({ error: "Bad request", error_description: error.message });
    //   }
    // }
}
  