// src/config/env.validation.ts

import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Local = 'local',
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

  @IsString()
  @IsOptional()
  DB_HOST?: string = 'localhost';

  @IsNumber()
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DB_USERNAME?: string = 'postgres';

  @IsString()
  @IsOptional()
  DB_PASSWORD?: string = 'postgres';

  @IsString()
  @IsOptional()
  DB_NAME?: string = 'cachalot_db';

  @IsNumber()
  @IsOptional()
  DB_POOL_SIZE: number = 10;

  @IsBoolean()
  @IsOptional()
  DB_SSL: boolean = false;

  @IsBoolean()
  @IsOptional()
  DB_LOGGING: boolean = false;

  @IsBoolean()
  @IsOptional()
  DB_SYNCHRONIZE: boolean = false;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Error de validación de variables de entorno: ${errors.toString()}`,
    );
  }

  return validatedConfig;
}
