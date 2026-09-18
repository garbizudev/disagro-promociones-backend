import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginacionDto } from "../../common/dto/paginacion.dto.js";
import { TipoItem } from "../../generated/prisma/client.js";

export class BuscarItemsAdminDto extends PaginacionDto {
  @ApiPropertyOptional({ example: "consultoria" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TipoItem })
  @IsOptional()
  @IsEnum(TipoItem)
  tipo?: TipoItem;
}
