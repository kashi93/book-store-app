import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as Joi from "joi";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required()
      })
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
