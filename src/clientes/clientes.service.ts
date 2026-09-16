import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CrearClienteDto } from "./dto/crear-cliente.dto.js";

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarOCrear(
    dto: CrearClienteDto,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const existente = await tx.cliente.findUnique({
      where: { email: dto.email },
    });
    if (existente) {
      return { cliente: existente, esNuevo: false };
    }

    const documentoEnUso = await tx.cliente.findUnique({
      where: { numeroDocumento: dto.numeroDocumento },
    });
    if (documentoEnUso) {
      throw new ConflictException(
        `El número de documento ya ha sido utilizado.`,
      );
    }

    const cliente = await tx.cliente.create({ data: dto });
    return { cliente, esNuevo: true };
  }
}
