import { Formula, Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export type Client = {
    id: number,
    name: string,
    loyalty: string,
    rating: string,
}

export type Driver = {
    id: number,
    name: string,
    loyalty: string,
    rating: string,
}

export type Vehicle = {
    id: number,
    type: string,
    fuelType: string
}

export type Order = {
    id: number,
    formulaId: number,
    paymentMethod: string,
    distance: number,
}

export type City = {
    id: number,
    name: string,
    formulae: Formula[]
}

export type cachedOrder = {
    orderId: number,
    farePrice: number
}