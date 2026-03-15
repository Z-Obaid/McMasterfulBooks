import { Route, Get, Post, Delete, Body, Path, Queries, Tags } from 'tsoa';

export interface FilterInput {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

export interface BookDto {
  id?: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
}

@Route('books')
@Tags('Books')
export class BooksRoute {
  @Get()
  public async listBooks(@Queries() _query?: FilterInput): Promise<BookDto[]> {
    return [];
  }

  @Get('{id}')
  public async getBook(@Path() id: string): Promise<BookDto | null> {
    return null;
  }

  @Post()
  public async createOrUpdateBook(@Body() body: BookDto): Promise<{ id: string }> {
    return { id: body.id ?? 'generated-by-api' };
  }

  @Delete('{id}')
  public async deleteBook(@Path() id: string): Promise<void> {
    return;
  }
}
