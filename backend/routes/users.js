"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bcrypt = require("bcrypt");
var database_1 = require("../utils/database");
var jsonwebtoken_1 = require("jsonwebtoken");
var router = (0, express_1.Router)();
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user, db, searchResult, hashedPassword, queryResult, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.body;
                if (!(data && data.login && data.password)) return [3 /*break*/, 11];
                user = data;
                return [4 /*yield*/, (0, database_1.getDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("users").findOne({ login: data.login })];
            case 2:
                searchResult = _a.sent();
                if (!!searchResult) return [3 /*break*/, 9];
                return [4 /*yield*/, bcrypt.hash(user.password, 10)];
            case 3:
                hashedPassword = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 7, , 8]);
                return [4 /*yield*/, db.collection("users").insertOne({ login: user.login, password: hashedPassword })];
            case 5:
                queryResult = _a.sent();
                token = (0, jsonwebtoken_1.sign)({ userId: queryResult.insertedId, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.SECRET);
                return [4 /*yield*/, db.collection("users").updateOne({ _id: queryResult.insertedId }, { token: token })];
            case 6:
                _a.sent();
                res.status(201).json({ message: "Удачно зарегистрировались", token: token });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).json({ message: "Произошла ошибка при регистрации, попробуйте ещё раз" });
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(401).json({ message: "Такой пользователь уже существует" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(400);
                _a.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user, db, expectedUser, compareResult, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.body;
                if (!(data && data.login && data.password)) return [3 /*break*/, 5];
                user = data;
                return [4 /*yield*/, (0, database_1.getDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("users").findOne({ login: user.login })];
            case 2:
                expectedUser = _a.sent();
                if (!!expectedUser) return [3 /*break*/, 3];
                res.status(404).json({ message: "Такой пользователь не найден" });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, bcrypt.compare(user.password, expectedUser.password)];
            case 4:
                compareResult = _a.sent();
                if (compareResult) {
                    token = (0, jsonwebtoken_1.sign)({ userId: expectedUser._id, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.SECRET);
                    res.status(200).json({ "message": "Успешный вход", token: token });
                }
                else {
                    res.status(401).json({ message: "Неверный пароль" });
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
