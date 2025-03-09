import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { env } from './shared/config/env';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.dbHost,
      port: env.dbPort,
      username: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
