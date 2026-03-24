import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { createKafkaClientOptions } from '@app/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ClientsModule.register([
      {
        name: 'ORDER_KAFKA',
        ...createKafkaClientOptions('api-gateway', 'api-gateway-group'),
      },
    ])
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
