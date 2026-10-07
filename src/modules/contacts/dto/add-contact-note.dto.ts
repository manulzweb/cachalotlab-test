import { IsNotEmpty, IsString } from 'class-validator';

export class AddContactNoteDto {
  @IsNotEmpty({ message: 'El contenido de la nota es obligatorio' })
  @IsString({ message: 'El contenido de la nota debe ser texto' })
  content: string;
}
