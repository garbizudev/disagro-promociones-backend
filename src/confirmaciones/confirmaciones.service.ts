import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientesService } from "../clientes/clientes.service.js";
import type { PaginatedResult } from "../common/paginated-result.interface.js";
import { Item, Prisma, TipoItem } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { BuscarConfirmacionesDto } from "./dto/buscar-confirmaciones.dto.js";
import { CrearConfirmacionDto } from "./dto/crear-confirmacion.dto.js";

@Injectable()
export class ConfirmacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientesService: ClientesService,
    private readonly jwtService: JwtService,
  ) {}

  async crear(dto: CrearConfirmacionDto) {
    const confirmacion = await this.prisma.$transaction(async (tx) => {
      const { cliente } = await this.clientesService.buscarOCrear(
        dto.cliente,
        tx,
      );

      const evento = await tx.evento.findUnique({
        where: { id: dto.eventoId },
      });

      if (!evento || !evento.activo) {
        throw new NotFoundException("El evento seleccionado no existe");
      }

      const items = await tx.item.findMany({
        where: { id: { in: dto.itemIds } },
      });

      if (items.length !== dto.itemIds.length) {
        throw new NotFoundException(
          "Uno o más ítems seleccionados no existen",
        );
      }

      const { descuentoServicios, descuentoProductos } =
        this.calcularDescuentos(items);

      return tx.confirmacion.create({
        data: {
          clienteId: cliente.id,
          eventoId: evento.id,
          descuentoServicios,
          descuentoProductos,
          items: {
            create: items.map((item) => ({
              itemId: item.id,
              precioAlMomento: item.precio,
            })),
          },
        },
        include: {
          items: { include: { item: true } },
          cliente: true,
          evento: true,
        },
      });
    });

    const accessToken = this.jwtService.sign({
      clienteId: confirmacion.clienteId,
    });

    return { ...confirmacion, accessToken };
  }

  buscarPorCliente(clienteId: number) {
    return this.prisma.confirmacion.findMany({
      where: { clienteId },
      include: {
        items: { include: { item: true } },
        cliente: true,
        evento: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async buscarTodas(
    dto: BuscarConfirmacionesDto,
  ): Promise<
    PaginatedResult<
      Prisma.ConfirmacionGetPayload<{
        include: {
          items: { include: { item: true } };
          cliente: true;
          evento: true;
        };
      }>
    >
  > {
    const where: Prisma.ConfirmacionWhereInput = {};

    if (dto.search) {
      where.cliente = {
        OR: [
          { nombre: { contains: dto.search, mode: "insensitive" } },
          { apellidos: { contains: dto.search, mode: "insensitive" } },
          { email: { contains: dto.search, mode: "insensitive" } },
          { numeroDocumento: { contains: dto.search, mode: "insensitive" } },
        ],
      };
    }

    if (dto.fecha) {
      const inicio = new Date(dto.fecha);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + 1);
      where.evento = { fechaHora: { gte: inicio, lt: fin } };
    }

    const [data, total] = await Promise.all([
      this.prisma.confirmacion.findMany({
        where,
        include: {
          items: { include: { item: true } },
          cliente: true,
          evento: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (dto.page - 1) * dto.pageSize,
        take: dto.pageSize,
      }),
      this.prisma.confirmacion.count({ where }),
    ]);

    return {
      data,
      total,
      page: dto.page,
      pageSize: dto.pageSize,
      totalPages: Math.ceil(total / dto.pageSize),
    };
  }

  private calcularDescuentos(items: Item[]) {
    const servicios = items.filter((item) => item.tipo === TipoItem.SERVICIO);
    const productos = items.filter((item) => item.tipo === TipoItem.PRODUCTO);

    let descuentoServicios = 0;
    if (servicios.length >= 2) {
      const sumaServicios = servicios.reduce(
        (total, servicio) => total + Number(servicio.precio),
        0,
      );
      descuentoServicios = sumaServicios > 1500 ? 5 : 3;
    }

    let descuentoProductos = 0;
    if (productos.length >= 5) {
      descuentoProductos = 5;
    } else if (productos.length >= 3) {
      descuentoProductos = 3;
    }

    return { descuentoServicios, descuentoProductos };
  }
}
