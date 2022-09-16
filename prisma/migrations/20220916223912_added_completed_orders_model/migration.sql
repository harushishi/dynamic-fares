-- CreateTable
CREATE TABLE "CompletedOrder" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "farePrice" INTEGER,

    CONSTRAINT "CompletedOrder_pkey" PRIMARY KEY ("id")
);
