import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty({ message: 'El contenido de la nota es obligatorio' })
  @IsString({ message: 'El contenido de la nota debe ser texto' })
  content: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del contacto debe ser numérico' })
  contactId?: number;
}
