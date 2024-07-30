import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from '@app/prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'web-app/dist'),
    }),
    BookModule,
    OrderModule,
    PrismaModule,
    CustomerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
