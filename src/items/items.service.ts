import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { BuscarItemsDto } from "./dto/buscar-items.dto.js";
import { CrearItemDto } from "./dto/crear-item.dto.js";

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  buscar(dto: BuscarItemsDto) {
    return this.prisma.item.findMany({
      where: {
        tipo: dto.tipo,
        nombre: dto.search
          ? { contains: dto.search, mode: "insensitive" }
          : undefined,
      },
      orderBy: { nombre: "asc" },
    });
  }

  crear(dto: CrearItemDto) {
    return this.prisma.item.create({ data: dto });
  }
}
