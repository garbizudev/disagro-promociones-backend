import { Module } from "@nestjs/common";
import { ClientesModule } from "../clientes/clientes.module.js";
import { ConfirmacionesController } from "./confirmaciones.controller.js";
import { ConfirmacionesService } from "./confirmaciones.service.js";

@Module({
  imports: [ClientesModule],
  controllers: [ConfirmacionesController],
  providers: [ConfirmacionesService],
})
export class ConfirmacionesModule {}
