import { Request, Response } from 'express';
import { calculateVars, testFormula } from '../util/formulaVars';
import Formula from 'fparser';
import { Client, Driver, Order, Vehicle } from '../util/types';
import { prismaClient, redisClient } from '../../app';
import { DEFAULT_EXP } from '../util/constants';

const calculateFare = async (req: Request, res: Response) => {
    const
        { order, client, driver, vehicle }:
            {
                order: Order, client: Client
                driver: Driver, vehicle: Vehicle
            } = req.body

    if ([order, client, driver, vehicle].some((e) => !e)) {
        return res.status(400).send({ message: `wrong request syntax` })
    }

    const completedOrder = await prismaClient.completedOrder.findFirst({
        where: {
            orderId: order.id
        }
    })

    //if the order was already fulfilled, exit.
    if (completedOrder) {
        return res.status(400).send({ message: `order already fulfilled` })
    }

    //check if calculated fare is available on cache
    const cachedFare = await redisClient.get(`order-${order.id}`)

    if (cachedFare != null) {
        console.log('cache hit')
        return res.json(JSON.parse(cachedFare))
    }

    const { cl, dl, cr, dr, vt, ft, pm, dt }
        = await calculateVars(client, driver, order, vehicle)

    if ([cl, dl, cr, dr, vt, ft, pm, dt]
        .some((e: any) => e.name === "NotFoundError" || !e)) {
        return res.status(500).send({ message: `missing data or wrong values` })
    }

    const formula = await prismaClient.formula.findUnique({
        where: {
            id: order.formulaId
        }, select: {
            definition: true
        }
    })

    if (!formula) {
        return res.status(404).send({ message: `formula not found` })
    }

    try {
        const fObj = new Formula(formula.definition);

        let result = fObj.evaluate
            ({
                cl: cl, dl: dl, cr: cr, dr: dr, vt: vt,
                ft: ft, pm: pm, dt: dt, dist: order.distance
            });

        const calculatedOrder = { orderId: order.id, farePrice: result }

        await redisClient.setEx(`order-${order.id}`, DEFAULT_EXP, JSON.stringify(calculatedOrder));

        console.log('no cache')
        res.json(calculatedOrder)
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

const addFormula = async (req: Request, res: Response) => {
    const cityId = Number(req.body.cityId)
    const formulaDefinition = req.body.formulaDefinition

    if (!cityId || !formulaDefinition) {
        return res.status(400).send({ message: `wrong request syntax` })
    }

    const city = await prismaClient.city.findUnique({
        where: {
            id: cityId
        }
    })
    if (!city) {
        return res.status(404).send({ message: `city not found` })
    }

    const formula = await prismaClient.formula.
        findFirst({
            where: {
                definition: formulaDefinition
            }
        })
    if (formula) {
        return res.status(400).send({ message: `formula already exists` })
    }

    if (!testFormula(formulaDefinition)) {
        return res.status(400).send({ message: `wrong formula syntax` })
    }

    try {
        await prismaClient.formula.create({
            data: {
                cityId: cityId,
                definition: formulaDefinition
            }
        })
        return res.status(200).send()
    } catch (error) {
        return res.status(500).send({ message: `failed to save formula` })
    }
}

// const oldCalulateFare = async (req: Request, res: Response) => {
//     // checking that everything exists and retrieving values for each variable
//     try {
//         const { clientId, driverId, cityId, paymentMethod, distance } = req.body
//         const formulaId = parseInt(req.params.formulaId)

//         const city = await prisma.city.findUnique({
//             where: {
//                 id: cityId
//             }
//         })
//         const client = await prisma.client.findUnique({
//             where: {
//                 id: clientId
//             }
//         })
//         const driver = await prisma.driver.findUnique({
//             where: {
//                 id: driverId
//             }, include: {
//                 vehicle: true
//             }
//         })
//         const vehicle = await prisma.vehicle.findUnique({
//             where: {
//                 id: driver?.vehicle?.id
//             }
//         })
//         const formula = await prisma.formula.findUnique({
//             where: {
//                 id: formulaId
//             }
//         })

//         const cl = await calculateLoyalty(client?.loyalty)
//         const dl = await calculateLoyalty(driver?.loyalty)
//         const cr = await calculateRating(client?.rating)
//         const dr = await calculateRating(driver?.rating)
//         const vh = await calculateVehType(vehicle?.type)
//         const ft = await calculateFuelType(vehicle?.fuelType)
//         const pm = await calculatePaymentMethod(paymentMethod)
//         const dt = await calculateDayTime()


//         // now that I have the values for all variables I might need to use depending on the formula, I calculate the corresponding fare

//         const fObj = new Formula(formula!.definition);
//         let result = fObj.evaluate({ cl: cl, dl: dl, cr: cr, dr: dr, vh: vh, ft: ft, pm: pm, dt: dt, dist: distance });

//         console.log(result)

//         res.status(200).json({ price: result })
//     } catch (error) {
//         res.status(400).send(error)
//     }
// }

export {
    calculateFare,
    addFormula
}