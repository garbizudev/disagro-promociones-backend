import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
}
