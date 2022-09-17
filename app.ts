import { PrismaClient } from "@prisma/client"
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { orderRouter } from "./src/routes/order";
import { createClient } from 'redis';

dotenv.config();
export const prismaClient = new PrismaClient()
const app: Express = express();
const port = process.env.APP_PORT;

export const redisClient = createClient();

(async () => {


    redisClient.on("error", (err: any) => console.log("Redis Client Error", err));

    await redisClient.connect();
})();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
app.use("/api/order", orderRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('API live');
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});