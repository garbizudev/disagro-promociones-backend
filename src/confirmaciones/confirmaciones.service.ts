import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientesService } from "../clientes/clientes.service.js";
import { Item, TipoItem } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
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
          fechaHoraEvento: new Date(dto.fechaHoraEvento),
          descuentoServicios,
          descuentoProductos,
          items: {
            create: items.map((item) => ({
              itemId: item.id,
              precioAlMomento: item.precio,
            })),
          },
        },
        include: { items: { include: { item: true } }, cliente: true },
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
      include: { items: { include: { item: true } }, cliente: true },
      orderBy: { createdAt: "desc" },
    });
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
