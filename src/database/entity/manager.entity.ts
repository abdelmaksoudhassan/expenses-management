import { Entity, OneToMany } from "typeorm";
import { Person } from "./person.parent";
import { Tool } from "./tool.entity";
import { Fuel } from "./fuel.entity";

@Entity()
export class Manager extends Person{
    @OneToMany(() => Tool, (tool) => tool.manager)
    tools: Tool[] 

    @OneToMany(() => Fuel, (fuel) => fuel.manager)
    fuel: Fuel[]
}