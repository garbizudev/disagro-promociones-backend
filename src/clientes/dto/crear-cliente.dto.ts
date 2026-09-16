import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CrearClienteDto {
  @ApiProperty({ example: "Juan" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: "Pérez" })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ example: "juan.perez@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "2900112345678" })
  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;
}
