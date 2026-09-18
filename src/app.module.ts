import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ClientesModule } from "./clientes/clientes.module.js";
import { ConfirmacionesModule } from "./confirmaciones/confirmaciones.module.js";
import { EventosModule } from "./eventos/eventos.module.js";
import { ItemsModule } from "./items/items.module.js";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientesModule,
    ConfirmacionesModule,
    ItemsModule,
    EventosModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
