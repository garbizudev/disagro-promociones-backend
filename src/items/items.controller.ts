import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BuscarItemsDto } from "./dto/buscar-items.dto.js";
import { CrearItemDto } from "./dto/crear-item.dto.js";
import { ItemsService } from "./items.service.js";

@ApiTags("items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  buscar(@Query() dto: BuscarItemsDto) {
    return this.itemsService.buscar(dto);
  }

  @Post()
  crear(@Body() dto: CrearItemDto) {
    return this.itemsService.crear(dto);
  }
}
