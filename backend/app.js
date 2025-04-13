"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("./routes/users");
var news_1 = require("./routes/news");
var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
var app = express();
dotenv.config({ path: '.env' });
app.use(cors({
    "origin": true, // Заменить на домен или на ip фронтенда для корректной работы Cors
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', users_1.default);
app.use('/news', news_1.default);
app.use('/uploads', express.static('uploads'));
app.listen(5001);
