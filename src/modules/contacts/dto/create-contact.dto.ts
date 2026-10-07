import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'La empresa debe ser un texto' })
  company?: string;
}
