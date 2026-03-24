import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ORDER_TOPICS } from '@app/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(ORDER_TOPICS.CREATE_ORDER)
  async handleCreateOrder(@Payload() message: any) {
    console.log("handleCreateOrder ==============", message);
    return this.orderService.handleCreateOrder(message.value ?? message);
  }

  @EventPattern(ORDER_TOPICS.ORDER_CREATED)
  async handleOrderCreated(@Payload() message: any) {
    console.log("handleOrderCreated ==============", message);
  }

  @EventPattern(ORDER_TOPICS.INVENTORY_RESERVED)
  async handleInventoryReserved(@Payload() message: any) {
    return this.orderService.handleInventoryReserved(message.value ?? message);
  }

  @EventPattern(ORDER_TOPICS.INVENTORY_REJECTED)
  async handleInventoryRejected(@Payload() message: any) {
    return this.orderService.handleInventoryRejected(message.value ?? message);
  }

  @EventPattern(ORDER_TOPICS.PAYMENT_COMPLETED)
  async handlePaymentCompleted(@Payload() message: any) {
    return this.orderService.handlePaymentCompleted(message.value ?? message);
  }

  @EventPattern(ORDER_TOPICS.PAYMENT_FAILED)
  async handlePaymentFailed(@Payload() message: any) {
    return this.orderService.handlePaymentFailed(message.value ?? message);
  }
}