/*
  Warnings:

  - You are about to drop the column `fechaHoraEvento` on the `Confirmacion` table. All the data in the column will be lost.
  - Added the required column `eventoId` to the `Confirmacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Confirmacion" DROP COLUMN "fechaHoraEvento",
ADD COLUMN     "eventoId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Confirmacion" ADD CONSTRAINT "Confirmacion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
