import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ClienteActual } from "../auth/cliente-actual.decorator.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ConfirmacionesService } from "./confirmaciones.service.js";
import { CrearConfirmacionDto } from "./dto/crear-confirmacion.dto.js";

@ApiTags("confirmaciones")
@Controller("confirmaciones")
export class ConfirmacionesController {
  constructor(
    private readonly confirmacionesService: ConfirmacionesService,
  ) {}

  @Post()
  crear(@Body() dto: CrearConfirmacionDto) {
    return this.confirmacionesService.crear(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  misConfirmaciones(@ClienteActual() clienteId: number) {
    return this.confirmacionesService.buscarPorCliente(clienteId);
  }
}
