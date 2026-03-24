import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { createKafkaClientOptions } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderModule, {
    ...createKafkaClientOptions('order-service-consumer', 'order-consumer-group'),
  });
  await app.listen();
}

bootstrap();
