import {Db, MongoClient} from 'mongodb'


const client = new MongoClient(process.env.MONGODB_CONN_STRING as string);
let dbInstance: Db;
/*
* Получает объект базы данных MongoDB
 */
export async function getDB(): Promise<Db> {
    try {
        if (!dbInstance) {
            await client.connect();
            dbInstance = client.db(process.env.MONGODB_NAME);
            await client.db().command({ ping: 1 });
        }
        return dbInstance;
    } catch (error) {
        await client.close();
        process.exit(1); // Завершаем процесс при ошибке подключения
    }
}