import {Router} from 'express';
import {User} from "../models/user"
import bcrypt = require('bcrypt');
import {getDB} from "../utils/database";
import {sign} from "jsonwebtoken"
import {InsertOneResult} from "mongodb";
const router = Router();
router.post("/register",async (req,res)=>{
    const data = req.body;
    if (data && data.login && data.password){
        const user = data as User;
        const db = await getDB();
        let searchResult = await db.collection("users").findOne({login: data.login})
        if (!searchResult){
            let hashedPassword = await bcrypt.hash(user.password,10)
            try {
                const queryResult:InsertOneResult<User> = await db.collection("users").insertOne({login: user.login, password: hashedPassword})
                let token = sign({ userId: queryResult.insertedId,exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.SECRET as string);
                res.status(201).json({message:"Удачно зарегистрировались",token:token})
            }
            catch (error){
                console.log(error)
                res.status(500).json({message:"Произошла ошибка при регистрации, попробуйте ещё раз"})
            }
        }
        else{
            res.status(401).json({message:"Такой пользователь уже существует"})
        }

    }
    else{
        res.status(400)
    }
})
router.post("/login",async (req,res)=>{
    const data = req.body;
    if (data && data.login && data.password){
        const user = data as User;
        const db = await getDB();
        let expectedUser = await db.collection("users").findOne({login:user.login})
        if (!expectedUser){
            res.status(404).json({message:"Такой пользователь не найден"})
        }
        else{
            let compareResult = await bcrypt.compare(user.password,expectedUser.password)
            if (compareResult){
                let token = sign({ userId: expectedUser._id,exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.SECRET as string);
                res.status(200).json({"message":"Успешный вход",token:token})
            }
            else{
                res.status(401).json({message:"Неверный пароль"})
            }
        }
    }
})

export default router;