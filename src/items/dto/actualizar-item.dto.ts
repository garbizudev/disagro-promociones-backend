import { OmitType, PartialType } from "@nestjs/swagger";
import { CrearItemDto } from "./crear-item.dto.js";

export class ActualizarItemDto extends PartialType(
  OmitType(CrearItemDto, ["tipo"] as const),
) {}
