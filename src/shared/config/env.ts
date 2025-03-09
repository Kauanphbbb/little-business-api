import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  NotEquals,
  validateSync,
} from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  @NotEquals('your_secret_key')
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  dbHost: string;

  @IsNumber()
  @IsNotEmpty()
  dbPort: number;

  @IsString()
  @IsNotEmpty()
  dbName: string;

  @IsString()
  @IsNotEmpty()
  dbUser: string;

  @IsString()
  @IsNotEmpty()
  dbPassword: string;
}

export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
