import { PartialType } from "@nestjs/swagger";
import { CrearEventoDto } from "./crear-evento.dto.js";

export class ActualizarEventoDto extends PartialType(CrearEventoDto) {}
