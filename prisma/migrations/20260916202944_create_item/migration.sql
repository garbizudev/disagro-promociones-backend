-- CreateEnum
CREATE TYPE "TipoItem" AS ENUM ('SERVICIO', 'PRODUCTO');

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoItem" NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
