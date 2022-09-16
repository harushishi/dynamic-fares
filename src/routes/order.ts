import express from 'express';
import { calculateFare } from '../controllers/orderController';

const orderRouter = express.Router()

orderRouter.get("/calculate", calculateFare)

export { orderRouter }