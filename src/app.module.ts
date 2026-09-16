import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ClientesModule } from "./clientes/clientes.module.js";
import { ConfirmacionesModule } from "./confirmaciones/confirmaciones.module.js";
import { ItemsModule } from "./items/items.module.js";

@Module({
  imports: [PrismaModule, ClientesModule, ConfirmacionesModule, ItemsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
