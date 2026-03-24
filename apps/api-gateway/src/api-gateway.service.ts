import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderDto, NotifyOrderCreatedDto, UpdateOrderDto } from '@app/common';
import { ORDER_TOPICS } from '@app/common';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  constructor(
    @Inject('ORDER_KAFKA')
    private readonly orderKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.orderKafka.connect();
  }

  createOrder(createOrderDto: CreateOrderDto) {
    this.orderKafka.emit(ORDER_TOPICS.CREATE_ORDER, {
      value: createOrderDto,
    });
  }

  notifyOrderCreated(notifyOrderCreatedDto: NotifyOrderCreatedDto) {
    this.orderKafka.emit(ORDER_TOPICS.ORDER_CREATED, {
      value: notifyOrderCreatedDto,
    });
  }
}
