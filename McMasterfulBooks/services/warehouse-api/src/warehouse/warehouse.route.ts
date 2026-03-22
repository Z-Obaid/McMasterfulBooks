import { Body, Controller, Get, Path, Post, Route, Tags } from "tsoa";
import { warehouseStore, type ShelfStock } from "./store";

export interface PlaceBooksRequest {
  numberOfBooks: number;
}

export interface FulfilOrderRequest {
  booksFulfilled: Array<{
    book: string;
    shelf: string;
    numberOfBooks: number;
  }>;
}

@Route("warehouse")
@Tags("Warehouse")
export class WarehouseController extends Controller {
  @Post("shelves/{shelf}/books/{bookId}")
  public async placeBooksOnShelf(
    @Path() shelf: string,
    @Path() bookId: string,
    @Body() body: PlaceBooksRequest,
  ): Promise<{ ok: true }> {
    warehouseStore.placeBooksOnShelf(bookId, body.numberOfBooks, shelf);
    return { ok: true };
  }

  @Get("books/{bookId}")
  public async findBookOnShelf(@Path() bookId: string): Promise<ShelfStock[]> {
    return warehouseStore.findBookOnShelf(bookId);
  }

  @Post("internal/fulfil")
  public async fulfilOrder(@Body() body: FulfilOrderRequest): Promise<{ ok: true }> {
    for (const item of body.booksFulfilled) {
      warehouseStore.removeBooksFromShelf(item.book, item.numberOfBooks, item.shelf);
    }

    return { ok: true };
  }
}
