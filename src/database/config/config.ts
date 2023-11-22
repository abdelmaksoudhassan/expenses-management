import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";
import * as config from 'config'

const db = config.get('db')
export const typeOrmConfig:TypeOrmModuleOptions = {
    type: db.type,
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    entities: [join(__dirname,'./../**','*.entity.{js,ts}')],
    synchronize: db.synchronize
}