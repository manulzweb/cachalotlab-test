import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({ description: 'ID único de la nota', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Contenido textual de la nota',
    example: 'Interesado en demostración de la plataforma.',
  })
  content: string;

  @ApiPropertyOptional({
    description: 'ID del contacto al que pertenece la nota',
    example: 1,
  })
  contactId?: number;

  @ApiProperty({ description: 'Fecha de creación de la nota' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización de la nota' })
  updatedAt: Date;
}
