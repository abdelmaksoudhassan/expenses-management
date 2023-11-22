import { PassportStrategy } from "@nestjs/passport";
import { Strategy,ExtractJwt } from 'passport-jwt'
import { AuthenticationService } from "../authentication.service";
import { JwtPayload } from "./jwt-payload.interface";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as config from 'config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authenticationService: AuthenticationService){
      const jwtConfig = config.get('jwt')
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: jwtConfig.secret
        });
    }

    async validate(jwtpayload:JwtPayload): Promise<any> {
      const person = await this.authenticationService.validatePerson(jwtpayload);
      if (!person) {
        throw new UnauthorizedException();
      }
      return person;
    }
}