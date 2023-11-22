import { Column, Entity, ManyToOne } from "typeorm";
import { Purchase } from "./purchase.parent";
import { Employee } from "./employee.entity";
import { Status } from "../enum/status.enum";
import { Manager } from "./manager.entity";

@Entity()
export class Fuel extends Purchase{
    @Column()
    start: number

    @Column()
    end: number

    @ManyToOne(() => Employee, (employee) => employee.fuel,{onDelete:'CASCADE'})
    employee: Employee

    @ManyToOne(() => Manager, (manager) => manager.fuel)
    manager: Manager

    constructor(title:string,price:number,receipt:string,status:Status,start: number,end: number, employee:Employee){
        super(title,price,receipt,status)
        this.start = start
        this.end = end
        this.employee = employee
    }
}