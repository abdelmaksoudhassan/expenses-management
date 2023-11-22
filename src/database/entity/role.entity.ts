import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(() => Employee, (employee) => employee.role)
    employees: Employee[]
}