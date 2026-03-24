import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClientOptions } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ClientsModule.register([
      {
        name: 'ORDER_EVENT_CLIENT',
        ...createKafkaClientOptions('order-service-producer', 'order-producer-group'),
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
