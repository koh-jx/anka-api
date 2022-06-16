import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   // Standard supplying of bearer token
      ignoreExpiration: false,                                    // Passport to ensure that JWT has not expired
      secretOrKey: jwtConstants.secret,                           
    });
  }

  // Passport verifies JWT's signature, invokes validate().
  // Since payload from JWT is bound to be valid, we can just return the payload.
  // Inject more stuff using database lookup in the future to add more stuff into req
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}