import {Router} from 'express';
import {scheduleJob} from 'node-schedule'
import {verifyToken} from "../middleware/authMiddleware";
import multer = require("multer");
import {getDB} from "../utils/database";
import {ObjectId} from "mongodb";
import {newsData} from "../schemes/news";
const router = Router();
// Для Yandex.Cloud нужно написать отдельный StorageEngine, чтобы он загружал файл и отдавал его на объектное хранилище
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname.split(".")[0] + '-' + uniqueSuffix + "." + file.originalname.split(".")[1])
    }
})
const upload = multer({storage})
function publishNews(id:ObjectId){
    getDB().then((db)=>{
        db.collection("news").updateOne({_id:id},{$set:{published:true}})
    })

}
router.post('/uploadFile',verifyToken,upload.single("file"),async (req,res)=>{
    if (req.file) {
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        res.json({
            message: 'Файл успешно загружен',
            url: fileUrl
        });
    }
})
router.post('/sendNews',verifyToken,async (req:any,res)=>{
    const news = req.body as newsData;
    let currentDate = null;
    const db = await getDB();
    console.log(req.userId)
    if (news.redacted) {
        let published = false;
        if (!news.publish_date){
            published = true;
        }
        else if (!news.chernovik && new Date(news.publish_date) < new Date()){
            published=true;
        }
        await db.collection("news").updateOne({_id:new ObjectId(news._id)},{$set:{
            title: news.title,
            description: news.description,
            published: !news.chernovik && new Date(news.publish_date) < new Date(),
            publish_date: news.publish_date,
            authorId: req.userId
        }})
        if (new Date(news.publish_date)>=new Date()){
            scheduleJob(news.publish_date, function (id: ObjectId) {
                publishNews(id)
            }.bind(null, new ObjectId(news._id)))
        }
    }
    else {
        if (news.chernovik) {
            await db.collection("news").insertOne({
                title: news.title,
                description: news.description,
                published: false,
                publish_date: null,
                authorId: req.userId
            })
        } else {
            if (news.publish_date && news.publish_date != "") {
                currentDate = new Date(news.publish_date);
            }
            if (currentDate) {
                let operation = await db.collection("news").insertOne({
                    title: news.title,
                    description: news.description,
                    published: false,
                    publish_date: currentDate,
                    authorId: req.userId
                });
                scheduleJob(currentDate, function (id: ObjectId) {
                    publishNews(id)
                }.bind(null, operation.insertedId))
            } else {
                await db.collection("news").insertOne({
                    title: news.title,
                    description: news.description,
                    published: true,
                    publish_date: null,
                    authorId: req.userId
                })
            }
            res.status(200)
        }
    }
})
router.get("/myNews",verifyToken,async (req:any,res)=>{
    const db = await getDB()
    const news :any= await db.collection("news").find({authorId:req.userId}).sort({ _id: -1 }).toArray()
    for (let i=0; i<news.length; i++) {
        news[i].id = i;
        news[i]._id = news[i]._id.toString();
    }
    res.status(200).json(news)
})
router.get('/',async (req,res)=>{
    const db = await getDB()
    const news :any= await db.collection("news").find({published:true}).sort({ _id: -1 }).toArray()
    for (let i=0; i<news.length; i++) {
        news[i].id = i;
        delete news[i]._id
    }
    res.status(200).json(news)
})
router.delete('/:id',verifyToken,async (req:any,res)=>{
    const db = await getDB()
    const news :any= await db.collection("news").findOne({ _id:new ObjectId(req.params.id)})
    if (news) {
        if (news.authorId === req.userId) {
            await db.collection("news").deleteOne({_id: new ObjectId(req.params.id)})
            res.status(200).json({status:"success"})
        }
    }
})
export default router;