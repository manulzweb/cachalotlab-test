import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'Contenido actualizado de la nota',
    example: 'Reunión reprogramada para el viernes a las 10:00 AM.',
  })
  @IsNotEmpty({ message: 'El contenido de la nota es obligatorio' })
  @IsString({ message: 'El contenido de la nota debe ser texto' })
  content: string;
}
