import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Nombre completo del contacto',
    example: 'Manuel Zapata',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico único del contacto',
    example: 'manuel@example.com',
  })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Número telefónico del contacto',
    example: '+573001234567',
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Empresa u organización asociada',
    example: 'Cachalot Lab',
  })
  @IsOptional()
  @IsString({ message: 'La empresa debe ser un texto' })
  company?: string;
}
