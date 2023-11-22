import { NotAcceptableException } from '@nestjs/common'
import { hashSync,genSaltSync } from 'bcrypt'
import { unlink } from 'fs'

export async function hashPassword(password: string):Promise<string>{
    const salt = await genSaltSync(5)
    const hashed = await hashSync(password,salt)
    return hashed
}

export function validatePassword(password:string){
    const regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
    if(!password.match(regularExpression)){
        throw new NotAcceptableException('password must be at min 8 letter, at least a symbol, upper and lower case letters and a number')
    }
}

export function deletePhoto(path:string){
    unlink(path,(err)=>{
        (err) ? console.log(err) : console.log(`${path} deleted from storage`)
    })
}