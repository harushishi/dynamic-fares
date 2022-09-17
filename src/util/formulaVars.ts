import { prismaClient } from '../../app';
import { Client, Driver, Order, Vehicle } from '../util/types';


export async function calculateVars(client: Client, driver: Driver, order:
    Order, vehicle: Vehicle) {
    const cl = await calculateLoyalty(client.loyalty)
    const dl = await calculateLoyalty(driver.loyalty)
    const cr = await calculateRating(client.rating)
    const dr = await calculateRating(driver.rating)
    const vt = await calculateVehType(vehicle.type)
    const ft = await calculateFuelType(vehicle.fuelType)
    const pm = await calculatePaymentMethod(order.paymentMethod)
    const dt = await calculateDayTime()

    return ({ cl, dl, cr, dr, vt, ft, pm, dt })
}

async function calculateLoyalty(loyalty: string | undefined) {
    try {

        const value = await prismaClient.modValue.findFirstOrThrow({
            where: {
                modifierId: 1,
                AND: {
                    name: loyalty
                }
            }
        })

        return value.value;

    } catch (error) {
        return error
    }
}

async function calculateRating(rating: string | undefined) {
    try {

        const value = await prismaClient.modValue.findFirstOrThrow({
            where: {
                modifierId: 2,
                AND: {
                    name: rating
                }
            }
        })

        return value.value;

    } catch (error) {
        return error
    }
}
async function calculateVehType(vehicle: string | undefined) {
    try {

        const value = await prismaClient.modValue.findFirstOrThrow({
            where: {
                modifierId: 4,
                AND: {
                    name: vehicle
                }
            }
        })

        return value.value;

    } catch (error) {
        return error
    }
}

async function calculateDayTime() {

    try {

        const date = new Date().getHours()
        let daytime = ''

        if (date >= 7 && date <= 19) {
            daytime = 'day'
        } else {
            daytime = 'night'
        }

        const value = await prismaClient.modValue.findFirstOrThrow({
            where: {
                modifierId: 3,
                AND: {
                    name: daytime
                }
            }
        })

        return value.value;

    } catch (error) {
        return error
    }
}

async function calculateFuelType(fuel: string | undefined) {
    try {

        const value = await prismaClient.modValue.findFirstOrThrow({
            where: {
                modifierId: 5,
                AND: {
                    name: fuel
                }
            }
        })

        return value.value;

    } catch (error) {
        return error
    }
}

async function calculatePaymentMethod(pm: string | undefined) {
    try {

        const value = await prismaClient.modValue.findFirstOrThrow({
            where: {
                modifierId: 6,
                AND: {
                    name: pm
                }
            }
        })

        return value.value;

    } catch (error) {
        return error
    }
}

