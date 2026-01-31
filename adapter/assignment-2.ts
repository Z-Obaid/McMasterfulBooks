//adapter files translate frontend actions into http requests to the backend API

//reusing booktype from assignment-1
import { Book } from './assignment-1';

export type BookID = string;

const API_URL = 'http://localhost:3000';

async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
  const query = filters?.map(({ from, to }, index) => {
    let result = '';
    if (from !== undefined) result += `filters[${index}][from]=${from}&`;
    if (to !== undefined) result += `filters[${index}][to]=${to}&`;
    return result;
  }).join('') ?? ''; //join array of strings to single string, ?? '' fallback if string undefined

  //send GET request and wait untill responce recieved
  const res = await fetch(`${API_URL}/books?${query}`);

  if (!res.ok) throw new Error('Failed to fetch books');

  //wait for http request to convert to json and return, treating it as Book object
  //wait ensures promise resolves to actual data before returning
  return await res.json() as Book[];
}


//send new book to backend, return its ID
//default fetch is GET, override with POST
async function createBook(book: Book): Promise<BookID> {
    const res = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book) //covert js object to json string
    });

    if (!res.ok) {
        throw new Error('Failed to create book');
    }

    const data = await res.json() as { id: BookID };
    return data.id;
}



async function removeBook(id: BookID): Promise<void> {
    const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        throw new Error('Failed to delete book');
    }
}


export default {
    assignment: 'assignment-2',
    listBooks,
    createBook,
    removeBook
};
