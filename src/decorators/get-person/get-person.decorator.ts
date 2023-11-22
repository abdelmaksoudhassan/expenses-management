import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data,req):any=>{
    // return req.user
    return req.args[0].user
})
