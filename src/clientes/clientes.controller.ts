import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { ClientesService } from "./clientes.service.js";
import { CrearClienteDto } from "./dto/crear-cliente.dto.js";

@ApiTags("clientes")
@Controller("clientes")
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async crear(
    @Body() dto: CrearClienteDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { cliente, esNuevo } = await this.clientesService.buscarOCrear(dto);
    res.status(esNuevo ? 201 : 200);
    return cliente;
  }
}
