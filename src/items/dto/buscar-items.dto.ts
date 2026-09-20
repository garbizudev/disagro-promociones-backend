import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TipoItem } from "../../generated/prisma/client.js";

export class BuscarItemsDto {
  @ApiPropertyOptional({ example: "consultoria" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TipoItem })
  @IsOptional()
  @IsEnum(TipoItem)
  tipo?: TipoItem;
}
