import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { TipoItem } from "../../generated/prisma/client.js";

export class CrearItemDto {
  @ApiProperty({ enum: TipoItem, example: TipoItem.SERVICIO })
  @IsEnum(TipoItem)
  tipo: TipoItem;

  @ApiProperty({ example: "Consultoria Premium" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ required: false, example: "Descripcion del servicio" })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 900.0 })
  @IsNumber()
  @IsPositive()
  precio: number;
}
