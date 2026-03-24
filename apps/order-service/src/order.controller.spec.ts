import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceController } from './order.controller';
import { OrderServiceService } from './order.service';

describe('OrderServiceController', () => {
  let orderServiceController: OrderServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderServiceController],
      providers: [OrderServiceService],
    }).compile();

    orderServiceController = app.get<OrderServiceController>(OrderServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderServiceController.getHello()).toBe('Hello World!');
    });
  });
});
