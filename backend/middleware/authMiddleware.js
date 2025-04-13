"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
var jwt = require("jsonwebtoken");
/*
* Middleware для проверки JWT токенов
* @param {req} - объект запроса пользователя
* @param {res} - объект ответа сервера
* @param {next} - следующая функция
* */
function verifyToken(req, res, next) {
    var _a;
    var token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.slice(7);
    if (!token) {
        console.log('No token provided');
        res.status(401).json({ error: 'Доступ запрещён' });
        return;
    }
    try {
        var decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Неверный токен' });
    }
}
