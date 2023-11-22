import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import {toUpper,includes} from 'lodash'
export const RequestHeader = createParamDecorator(
  async (value:  any, ctx: ExecutionContext) => {
    const {deletetype} = ctx.switchToHttp().getRequest().headers;
    const val = toUpper(deletetype)
    
    if(!includes(['DELETE','SOFT DELETE'],val)){
      throw new BadRequestException(`${deletetype} is invalid delete type`)
    }
    return val;
  },
);