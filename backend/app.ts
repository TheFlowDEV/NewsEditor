import UserRouter from './routes/users'
import NewsRouter from './routes/news'
import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';
const app = express();
dotenv.config({ path: '.env' });
app.use(cors({
    "origin":"http://localhost:3000", // Заменить на домен или на ip фронтенда для корректной работы Cors
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users',UserRouter);
app.use('/news',NewsRouter);
app.use('/uploads', express.static('uploads'));
app.listen(5001);