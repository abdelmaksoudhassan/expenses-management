import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Manager } from 'src/database/entity/manager.entity';

@Injectable()
export class ManagerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(request.user instanceof Manager){
      return true;
    }
    throw new UnauthorizedException()
  }
}