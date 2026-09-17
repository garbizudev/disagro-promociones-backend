import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class BuscarConfirmacionesDto {
  @ApiPropertyOptional({ example: "juan" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: "2026-10-20" })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
