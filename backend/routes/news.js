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
var node_schedule_1 = require("node-schedule");
var authMiddleware_1 = require("../middleware/authMiddleware");
var multer = require("multer");
var database_1 = require("../utils/database");
var mongodb_1 = require("mongodb");
var router = (0, express_1.Router)();
// Для Yandex.Cloud нужно написать отдельный StorageEngine, чтобы он загружал файл и отдавал его на объектное хранилище
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname.split(".")[0] + '-' + uniqueSuffix + "." + file.originalname.split(".")[1]);
    }
});
var upload = multer({ storage: storage });
function publishNews(id) {
    (0, database_1.getDB)().then(function (db) {
        db.collection("news").updateOne({ _id: id }, { $set: { published: true } });
    });
}
router.post('/uploadFile', authMiddleware_1.verifyToken, upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var protocol, host, fileUrl;
    return __generator(this, function (_a) {
        if (req.file) {
            protocol = req.protocol;
            host = req.get('host');
            fileUrl = "".concat(protocol, "://").concat(host, "/uploads/").concat(req.file.filename);
            res.json({
                message: 'Файл успешно загружен',
                url: fileUrl
            });
        }
        return [2 /*return*/];
    });
}); });
router.post('/sendNews', authMiddleware_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var news, currentDate, db, published, operation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                news = req.body;
                currentDate = null;
                return [4 /*yield*/, (0, database_1.getDB)()];
            case 1:
                db = _a.sent();
                console.log(req.userId);
                if (!news.redacted) return [3 /*break*/, 3];
                published = false;
                if (!news.publish_date) {
                    published = true;
                }
                else if (!news.chernovik && new Date(news.publish_date) < new Date()) {
                    published = true;
                }
                return [4 /*yield*/, db.collection("news").updateOne({ _id: new mongodb_1.ObjectId(news._id) }, { $set: {
                            title: news.title,
                            description: news.description,
                            published: !news.chernovik && new Date(news.publish_date) < new Date(),
                            publish_date: news.publish_date,
                            authorId: req.userId
                        } })];
            case 2:
                _a.sent();
                if (new Date(news.publish_date) >= new Date()) {
                    (0, node_schedule_1.scheduleJob)(news.publish_date, function (id) {
                        publishNews(id);
                    }.bind(null, new mongodb_1.ObjectId(news._id)));
                }
                return [3 /*break*/, 10];
            case 3:
                if (!news.chernovik) return [3 /*break*/, 5];
                return [4 /*yield*/, db.collection("news").insertOne({
                        title: news.title,
                        description: news.description,
                        published: false,
                        publish_date: null,
                        authorId: req.userId
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 10];
            case 5:
                if (news.publish_date && news.publish_date != "") {
                    currentDate = new Date(news.publish_date);
                }
                if (!currentDate) return [3 /*break*/, 7];
                return [4 /*yield*/, db.collection("news").insertOne({
                        title: news.title,
                        description: news.description,
                        published: false,
                        publish_date: currentDate,
                        authorId: req.userId
                    })];
            case 6:
                operation = _a.sent();
                (0, node_schedule_1.scheduleJob)(currentDate, function (id) {
                    publishNews(id);
                }.bind(null, operation.insertedId));
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, db.collection("news").insertOne({
                    title: news.title,
                    description: news.description,
                    published: true,
                    publish_date: null,
                    authorId: req.userId
                })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                res.status(200);
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
router.get("/myNews", authMiddleware_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, news, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.getDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("news").find({ authorId: req.userId }).sort({ _id: -1 }).toArray()];
            case 2:
                news = _a.sent();
                for (i = 0; i < news.length; i++) {
                    news[i].id = i;
                    news[i]._id = news[i]._id.toString();
                }
                res.status(200).json(news);
                return [2 /*return*/];
        }
    });
}); });
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, news, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.getDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("news").find({ published: true }).sort({ _id: -1 }).toArray()];
            case 2:
                news = _a.sent();
                for (i = 0; i < news.length; i++) {
                    news[i].id = i;
                    delete news[i]._id;
                }
                res.status(200).json(news);
                return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', authMiddleware_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, news;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.getDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("news").findOne({ _id: new mongodb_1.ObjectId(req.params.id) })];
            case 2:
                news = _a.sent();
                if (!news) return [3 /*break*/, 4];
                if (!(news.authorId === req.userId)) return [3 /*break*/, 4];
                return [4 /*yield*/, db.collection("news").deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) })];
            case 3:
                _a.sent();
                res.status(200).json({ status: "success" });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
