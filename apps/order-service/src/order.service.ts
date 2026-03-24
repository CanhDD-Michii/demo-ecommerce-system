import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ORDER_TOPICS } from '@app/common';

@Injectable()
export class OrderService implements OnModuleInit {
  private readonly logger = new Logger(OrderService.name);
  private readonly orders = new Map<string, any>();

  constructor(
    @Inject('ORDER_EVENT_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async handleCreateOrder(payload: any) {
    this.orders.set(payload.orderId, {
      ...payload,
      status: 'PENDING_INVENTORY',
    });

    this.logger.log(`Order created: ${payload.orderId}`);

    this.kafkaClient.emit(ORDER_TOPICS.ORDER_CREATED, payload);
  }

  async handleInventoryReserved(payload: any) {
    const order = this.orders.get(payload.orderId);
    if (!order) return;

    order.status = 'PENDING_PAYMENT';
    this.orders.set(payload.orderId, order);

    this.kafkaClient.emit(ORDER_TOPICS.PAYMENT_PROCESS, payload);
  }

  async handleInventoryRejected(payload: any) {
    const order = this.orders.get(payload.orderId);
    if (!order) return;

    order.status = 'REJECTED_OUT_OF_STOCK';
    this.orders.set(payload.orderId, order);

    this.logger.warn(`Order rejected: ${payload.orderId}`);
  }

  async handlePaymentCompleted(payload: any) {
    const order = this.orders.get(payload.orderId);
    if (!order) return;

    order.status = 'COMPLETED';
    this.orders.set(payload.orderId, order);

    this.logger.log(`Order completed: ${payload.orderId}`);
  }

  async handlePaymentFailed(payload: any) {
    const order = this.orders.get(payload.orderId);
    if (!order) return;

    order.status = 'PAYMENT_FAILED';
    this.orders.set(payload.orderId, order);

    this.logger.error(`Payment failed: ${payload.orderId}`);
  }
}