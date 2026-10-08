import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddContactNoteDto {
  @ApiProperty({
    description: 'Contenido detallado de la nota para el contacto',
    example: 'Reunión de seguimiento programada para el próximo lunes a las 10:00 AM.',
  })
  @IsNotEmpty({ message: 'El contenido de la nota es obligatorio' })
  @IsString({ message: 'El contenido de la nota debe ser texto' })
  content: string;
}
