import { Route, Get, Post, Body, Path, Tags } from 'tsoa';

export interface PlaceBooksRequest {
  bookId: string;
  numberOfBooks: number;
  shelf: string;
}

export interface ShelfStockDto {
  shelf: string;
  count: number;
}

@Route('warehouse')
@Tags('Warehouse')
export class WarehouseRoute {
  @Post('shelves')
  public async placeBooks(@Body() _body: PlaceBooksRequest): Promise<{ success: boolean }> {
    return { success: true };
  }

  @Get('books/{bookId}/locations')
  public async locations(@Path() bookId: string): Promise<ShelfStockDto[]> {
    return [];
  }

  @Get('books/{bookId}/stock')
  public async stock(@Path() bookId: string): Promise<{ bookId: string; stock: number }> {
    return { bookId, stock: 0 };
  }
}
