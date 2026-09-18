import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminAuthGuard } from "../auth/admin-auth.guard.js";
import { ActualizarEventoDto } from "./dto/actualizar-evento.dto.js";
import { BuscarEventosAdminDto } from "./dto/buscar-eventos-admin.dto.js";
import { CrearEventoDto } from "./dto/crear-evento.dto.js";
import { EventosService } from "./eventos.service.js";

@ApiTags("eventos")
@Controller("eventos")
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get()
  buscarDisponibles() {
    return this.eventosService.buscarDisponibles();
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Get("admin")
  buscarAdmin(@Query() dto: BuscarEventosAdminDto) {
    return this.eventosService.buscarAdmin(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Post()
  crear(@Body() dto: CrearEventoDto) {
    return this.eventosService.crear(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Patch(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarEventoDto) {
    return this.eventosService.actualizar(Number(id), dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Patch(":id/activar")
  activar(@Param("id") id: string) {
    return this.eventosService.activar(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Patch(":id/desactivar")
  desactivar(@Param("id") id: string) {
    return this.eventosService.desactivar(Number(id));
  }
}
