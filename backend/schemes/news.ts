import {Block} from "../models/news";
import {ObjectId} from "mongodb";

export type newsData = {
    _id?:string,
    title: string,
    description:Block[];
    publish_date:string;
    chernovik:boolean;
    redacted:boolean;
}