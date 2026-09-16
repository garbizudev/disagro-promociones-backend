import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ClientesModule } from "./clientes/clientes.module.js";

@Module({
  imports: [PrismaModule, ClientesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
