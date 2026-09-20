import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CrearEventoDto {
  @ApiProperty({ example: "2026-10-20T15:00:00.000Z" })
  @IsDateString()
  fechaHora: string;
}
