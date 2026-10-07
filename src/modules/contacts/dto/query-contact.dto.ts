import { IsOptional, IsString } from 'class-validator';

export class QueryContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;
}
