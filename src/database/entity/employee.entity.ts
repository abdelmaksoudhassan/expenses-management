import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Role } from "./role.entity";
import { Tool } from "./tool.entity";
import { Fuel } from "./fuel.entity";
import { Person } from "./person.parent";

@Entity()
export class Employee extends Person{
    @Column({default: 0})
    balance: number

    @ManyToOne(() => Role, (role) => role.employees)
    role: Role

    @OneToMany(() => Tool, (tool) => tool.employee,{cascade:['insert','update']})
    tool: Tool[]

    @OneToMany(() => Fuel, (fuel) => fuel.employee,{cascade:['insert','update']})
    fuel: Fuel[]
    
    constructor(email:string, password:string,role:Role){
        super(email,password)
        this.role = role
    }
}