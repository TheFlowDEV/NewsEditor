import {JwtPayload} from "jsonwebtoken";
import {Request} from "express";

export interface Token extends JwtPayload{
    userId: number;
}
export interface userRequest extends Request{
    userId?:number;
}