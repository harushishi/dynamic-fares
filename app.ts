import { PrismaClient } from "@prisma/client"
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { orderRouter } from "./src/routes/order";

const prisma = new PrismaClient()
dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT;

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