import { Column, Entity, ManyToOne } from "typeorm";
import { Purchase } from "./purchase.parent";
import { Employee } from "./employee.entity";
import { Status } from "../enum/status.enum";
import { Manager } from "./manager.entity";

@Entity()
export class Tool extends Purchase{
    @Column()
    description: string

    @ManyToOne(() => Employee, (employee) => employee.tool,{onDelete:'CASCADE'})
    employee: Employee

    @ManyToOne(() => Manager, (manager) => manager.tools)
    manager: Manager

    constructor(title:string,price:number,receipt:string,status:Status,description:string,employee:Employee){
        super(title,price,receipt,status)
        this.description = description
        this.employee = employee
    }
}