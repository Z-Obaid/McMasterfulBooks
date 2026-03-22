import { Body, Controller, Get, Path, Post, Route, Tags } from "tsoa";
import { ordersStore, type OrderSummary } from "./store";

export interface CreateOrderRequest {
  order: string[];
}

export interface FulfilOrderRequest {
  booksFulfilled: Array<{
    book: string;
    shelf: string;
    numberOfBooks: number;
  }>;
}

@Route("orders")
@Tags("Orders")
export class OrdersController extends Controller {
  @Post()
  public async orderBooks(@Body() body: CreateOrderRequest): Promise<{ orderId: string }> {
    if (!Array.isArray(body.order) || body.order.length === 0) {
      this.setStatus(400);
      throw new Error("order must contain at least one book");
    }

    const order = ordersStore.createOrder(body.order);
    return { orderId: order.orderId };
  }

  @Post("{orderId}/fulfil")
  public async fulfilOrder(
    @Path() orderId: string,
    @Body() body: FulfilOrderRequest,
  ): Promise<{ ok: true }> {
    const order = ordersStore.getOrder(orderId);

    if (!order) {
      this.setStatus(404);
      throw new Error("Order not found");
    }

    const warehouseUrl = process.env.WAREHOUSE_API_URL || "http://warehouse-api:3002";
    const response = await fetch(`${warehouseUrl}/warehouse/internal/fulfil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      this.setStatus(response.status);
      throw new Error(text || "Failed to fulfil order in warehouse service");
    }

    return { ok: true };
  }

  @Get()
  public async listOrders(): Promise<OrderSummary[]> {
    return ordersStore.listOrders();
  }
}
