import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { ActualizarItemDto } from "./dto/actualizar-item.dto.js";
import { BuscarItemsDto } from "./dto/buscar-items.dto.js";
import { CrearItemDto } from "./dto/crear-item.dto.js";

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  buscar(dto: BuscarItemsDto) {
    return this.prisma.item.findMany({
      where: {
        activo: true,
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

  async actualizar(id: number, dto: ActualizarItemDto) {
    await this.buscarPorIdOFallar(id);
    return this.prisma.item.update({ where: { id }, data: dto });
  }

  async desactivar(id: number) {
    await this.buscarPorIdOFallar(id);
    return this.prisma.item.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async buscarPorIdOFallar(id: number) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Item no encontrado");
    }
    return item;
  }
}
