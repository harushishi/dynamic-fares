import express from 'express';
import { addFormula, calculateFare } from '../controllers/apiController';

const orderRouter = express.Router()

orderRouter.get("/calculate", calculateFare)
orderRouter.post("/formula/add", addFormula)

export { orderRouter }