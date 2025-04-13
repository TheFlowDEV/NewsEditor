import jwt = require('jsonwebtoken');
import { Response, NextFunction } from 'express';
import {userRequest,Token} from "../models/token";

/*
* Middleware для проверки JWT токенов
* @param {req} - объект запроса пользователя
* @param {res} - объект ответа сервера
* @param {next} - следующая функция
* */
export function verifyToken(req:userRequest, res:Response, next:NextFunction) {
    const token = req.header('Authorization')?.slice(7);
    if (!token) {
        console.log('No token provided');
        res.status(401).json({error: 'Доступ запрещён'});
        return;
    }
    try {
        const decoded:Token = jwt.verify(token, process.env.SECRET as string) as Token;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Неверный токен' });
    }
}

