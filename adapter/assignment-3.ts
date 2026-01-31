import previous_assignment from './assignment-2';

export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

export interface Filter {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

/**
 * Fetches books with optional filters.
 * - Multiple filters: any book matching at least one filter is returned
 * - Single filter: all specified conditions must match
 */
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  if (!filters || filters.length === 0) {
    return []; // No filters, return empty array immediately
  }
  const params = new URLSearchParams();

  filters?.forEach((filter, index) => {
    const { from, to, name, author } = filter;

    if (typeof from === 'number') params.append(`filters[${index}][from]`, from.toString());
    if (typeof to === 'number') params.append(`filters[${index}][to]`, to.toString());
    if (name?.trim()) params.append(`filters[${index}][name]`, name.trim());
    if (author?.trim()) params.append(`filters[${index}][author]`, author.trim());
  });

  const response = await fetch(`http://localhost:3000/books?${params.toString()}`);

  if (!response.ok) throw new Error('Failed to fetch books');

  return response.json() as Promise<Book[]>;
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createBook(book);
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book);
}

const assignment = 'assignment-3';

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
};
