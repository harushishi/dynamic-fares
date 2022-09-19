import express from 'express';
import { acceptFare, addFormula, calculateFare } from '../controllers/apiController';

const orderRouter = express.Router()

orderRouter.get("/fare/calculate", calculateFare)
orderRouter.post("/fare/accept/:id", acceptFare)
orderRouter.post("/formula/add", addFormula)

export { orderRouter }