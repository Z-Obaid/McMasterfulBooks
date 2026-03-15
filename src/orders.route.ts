import { Route, Get, Post, Body, Path, Tags } from 'tsoa';

export interface CreateOrderRequest {
  books: string[];
}

export interface FulfillmentItem {
  book: string;
  shelf: string;
  numberOfBooks: number;
}

export interface OrderDto {
  orderId: string;
  books: Record<string, number>;
  fulfilled?: boolean;
}

@Route('orders')
@Tags('Orders')
export class OrdersRoute {
  @Get()
  public async listOrders(): Promise<OrderDto[]> {
    return [];
  }

  @Get('{orderId}')
  public async getOrder(@Path() orderId: string): Promise<OrderDto | null> {
    return null;
  }

  @Post()
  public async createOrder(@Body() _body: CreateOrderRequest): Promise<{ orderId: string }> {
    return { orderId: 'generated-order-id' };
  }

  @Post('{orderId}/fulfill')
  public async fulfillOrder(
    @Path() orderId: string,
    @Body() _body: { fulfillment: FulfillmentItem[] }
  ): Promise<{ success: boolean }> {
    return { success: true };
  }
}
