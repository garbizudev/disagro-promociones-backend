import { Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResult } from "../common/paginated-result.interface.js";
import { Evento } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ActualizarEventoDto } from "./dto/actualizar-evento.dto.js";
import { BuscarEventosAdminDto } from "./dto/buscar-eventos-admin.dto.js";
import { CrearEventoDto } from "./dto/crear-evento.dto.js";

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  buscarDisponibles() {
    return this.prisma.evento.findMany({
      where: { activo: true, fechaHora: { gte: new Date() } },
      orderBy: { fechaHora: "asc" },
    });
  }

  async buscarAdmin(
    dto: BuscarEventosAdminDto,
  ): Promise<PaginatedResult<Evento>> {
    const [data, total] = await Promise.all([
      this.prisma.evento.findMany({
        orderBy: { fechaHora: "asc" },
        skip: (dto.page - 1) * dto.pageSize,
        take: dto.pageSize,
      }),
      this.prisma.evento.count(),
    ]);

    return {
      data,
      total,
      page: dto.page,
      pageSize: dto.pageSize,
      totalPages: Math.ceil(total / dto.pageSize),
    };
  }

  crear(dto: CrearEventoDto) {
    return this.prisma.evento.create({
      data: { fechaHora: new Date(dto.fechaHora) },
    });
  }

  async actualizar(id: number, dto: ActualizarEventoDto) {
    await this.buscarPorIdOFallar(id);
    return this.prisma.evento.update({
      where: { id },
      data: dto.fechaHora ? { fechaHora: new Date(dto.fechaHora) } : {},
    });
  }

  async activar(id: number) {
    await this.buscarPorIdOFallar(id);
    return this.prisma.evento.update({
      where: { id },
      data: { activo: true },
    });
  }

  async desactivar(id: number) {
    await this.buscarPorIdOFallar(id);
    return this.prisma.evento.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async buscarPorIdOFallar(id: number) {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento) {
      throw new NotFoundException("Evento no encontrado");
    }
    return evento;
  }
}
