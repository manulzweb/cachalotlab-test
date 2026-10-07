import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Contenido de la nota',
    example: 'Interesado en demostración de la plataforma.',
  })
  @IsNotEmpty({ message: 'El contenido de la nota es obligatorio' })
  @IsString({ message: 'El contenido de la nota debe ser texto' })
  content: string;

  @ApiProperty({
    description: 'ID numérico del contacto asociado',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del contacto es obligatorio' })
  @IsNumber({}, { message: 'El ID del contacto debe ser numérico' })
  contactId: number;
}
