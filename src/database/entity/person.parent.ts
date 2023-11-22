import { Column, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { compareSync } from 'bcrypt'
import { ConflictException } from "@nestjs/common";

export abstract class Person{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique:true })
    email: string

    @Column({select: false})
    password: string

    @DeleteDateColumn()
    deletedAt?: Date;

    constructor(email:string, password:string){
        this.email = email
        this.password = password
    }

    async checkPassword(password:string):Promise<boolean>{
        if(! password){
            throw new ConflictException('password needed')
        }
        return await compareSync(password,this.password)
    }
}