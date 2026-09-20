-- CreateTable
CREATE TABLE "Confirmacion" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "fechaHoraEvento" TIMESTAMP(3) NOT NULL,
    "descuentoServicios" INTEGER NOT NULL DEFAULT 0,
    "descuentoProductos" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Confirmacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmacionItem" (
    "id" SERIAL NOT NULL,
    "confirmacionId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "precioAlMomento" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ConfirmacionItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Confirmacion" ADD CONSTRAINT "Confirmacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmacionItem" ADD CONSTRAINT "ConfirmacionItem_confirmacionId_fkey" FOREIGN KEY ("confirmacionId") REFERENCES "Confirmacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmacionItem" ADD CONSTRAINT "ConfirmacionItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
