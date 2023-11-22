import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enum/status.enum";

export abstract class Purchase{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    price: number

    @Column()
    receipt: string

    @Column()
    status: Status

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor(title: string,price:number,receipt:string,status:Status){
        this.title = title
        this.price = price
        this.receipt = receipt
        this.status = status
    }
}