export type BookID = string;
export type ShelfId = string;

export interface ShelfStock {
  shelf: ShelfId;
  count: number;
}

class WarehouseStore {
  private readonly shelves = new Map<ShelfId, Map<BookID, number>>();

  placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): void {
    if (numberOfBooks <= 0) {
      throw new Error("numberOfBooks must be positive");
    }

    const shelfStock = this.shelves.get(shelf) ?? new Map<BookID, number>();
    shelfStock.set(bookId, (shelfStock.get(bookId) ?? 0) + numberOfBooks);
    this.shelves.set(shelf, shelfStock);
  }

  findBookOnShelf(bookId: BookID): ShelfStock[] {
    const matches: ShelfStock[] = [];
    for (const [shelf, books] of this.shelves.entries()) {
      const count = books.get(bookId) ?? 0;
      if (count > 0) {
        matches.push({ shelf, count });
      }
    }
    return matches;
  }

  removeBooksFromShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): void {
    if (numberOfBooks <= 0) {
      throw new Error("numberOfBooks must be positive");
    }

    const shelfStock = this.shelves.get(shelf);
    const current = shelfStock?.get(bookId) ?? 0;

    if (!shelfStock || current < numberOfBooks) {
      throw new Error("Not enough stock on shelf");
    }

    const next = current - numberOfBooks;
    if (next === 0) {
      shelfStock.delete(bookId);
    } else {
      shelfStock.set(bookId, next);
    }

    if (shelfStock.size === 0) {
      this.shelves.delete(shelf);
    }
  }
}

export const warehouseStore = new WarehouseStore();
