import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  ValidateNested,
} from "class-validator";
import { CrearClienteDto } from "../../clientes/dto/crear-cliente.dto.js";

export class CrearConfirmacionDto {
  @ApiProperty({ type: CrearClienteDto })
  @ValidateNested()
  @Type(() => CrearClienteDto)
  cliente: CrearClienteDto;

  @ApiProperty({ example: 1 })
  @IsInt()
  eventoId: number;

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  itemIds: number[];
}
