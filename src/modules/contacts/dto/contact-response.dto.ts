import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactNoteResponseDto {
  @ApiProperty({ description: 'ID de la nota', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Contenido de la nota',
    example: 'Reunión de seguimiento programada.',
  })
  content: string;

  @ApiProperty({ description: 'Fecha de creación de la nota' })
  createdAt: Date;
}

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

  @ApiPropertyOptional({
    description: 'Lista de notas vinculadas al contacto',
    type: () => [ContactNoteResponseDto],
  })
  notes?: ContactNoteResponseDto[];
}
