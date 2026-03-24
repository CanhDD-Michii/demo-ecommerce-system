import { Controller, Post, Body } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateOrderDto, NotifyOrderCreatedDto } from '@app/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @Post('order')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.apiGatewayService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Notify order created' })
  @Post('order/notify')
  notifyOrderCreated(@Body() notifyOrderCreatedDto: NotifyOrderCreatedDto) {
    return this.apiGatewayService.notifyOrderCreated(notifyOrderCreatedDto);
  }
}
