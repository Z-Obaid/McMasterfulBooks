import crypto from "node:crypto";

export interface OrderSummary {
  orderId: string;
  books: Record<string, number>;
}

class OrdersStore {
  private readonly orders: OrderSummary[] = [];

  createOrder(bookIds: string[]): OrderSummary {
    const books: Record<string, number> = {};
    for (const bookId of bookIds) {
      books[bookId] = (books[bookId] ?? 0) + 1;
    }

    const order: OrderSummary = {
      orderId: crypto.randomUUID(),
      books,
    };

    this.orders.push(order);
    return order;
  }

  listOrders(): OrderSummary[] {
    return this.orders;
  }

  getOrder(orderId: string): OrderSummary | undefined {
    return this.orders.find((order) => order.orderId === orderId);
  }
}

export const ordersStore = new OrdersStore();
