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
import { ActualizarItemDto } from "./dto/actualizar-item.dto.js";
import { BuscarItemsDto } from "./dto/buscar-items.dto.js";
import { CrearItemDto } from "./dto/crear-item.dto.js";
import { TopItemsDto } from "./dto/top-items.dto.js";
import { ItemsService } from "./items.service.js";

@ApiTags("items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  buscar(@Query() dto: BuscarItemsDto) {
    return this.itemsService.buscar(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Get("populares")
  populares(@Query() dto: TopItemsDto) {
    return this.itemsService.populares(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Post()
  crear(@Body() dto: CrearItemDto) {
    return this.itemsService.crear(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Patch(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarItemDto) {
    return this.itemsService.actualizar(Number(id), dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Patch(":id/desactivar")
  desactivar(@Param("id") id: string) {
    return this.itemsService.desactivar(Number(id));
  }
}
