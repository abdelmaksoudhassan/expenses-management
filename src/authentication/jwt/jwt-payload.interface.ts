import { Title } from "../../database/enum/title.enum";

export interface JwtPayload{
    email: string,
    title: Title
}