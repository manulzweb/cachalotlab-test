import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({ description: 'ID único del contacto', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre completo del contacto', example: 'Manuel Zapata' })
  name: string;

  @ApiProperty({ description: 'Correo electrónico único', example: 'manuel@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Número de teléfono', example: '+573001234567' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Empresa', example: 'Cachalot Lab' })
  company?: string;

  @ApiProperty({ description: 'Fecha de creación del contacto' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del contacto' })
  updatedAt: Date;
}
