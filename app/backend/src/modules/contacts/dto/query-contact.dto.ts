import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryContactDto {
  @ApiPropertyOptional({
    description: 'Filtro por nombre de contacto (búsqueda parcial case-insensitive)',
    example: 'Manuel',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtro por nombre de empresa (búsqueda parcial case-insensitive)',
    example: 'Cachalot',
  })
  @IsOptional()
  @IsString()
  company?: string;
}
