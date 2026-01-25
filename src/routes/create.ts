import Router from '@koa/router';
import { ObjectId } from 'mongodb';
import { getBooksCollection } from '../db';

const router = new Router();

router.post('/books', async (ctx) => {
    const book = ctx.request.body as any;

    if (!book?.name || !book?.author || typeof book.price !== 'number') {
        ctx.status = 400;
        ctx.body = { error: 'Invalid book data' };
        return;
    }

    const result = await getBooksCollection().insertOne({
        name: book.name,
        author: book.author,
        description: book.description || '',
        price: book.price,
        image: book.image || ''
    });

    ctx.status = 201;
    ctx.body = { id: result.insertedId.toString() };
});

router.put('/books/:id', async (ctx) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid book ID' };
        return;
    }

    const book = ctx.request.body as any;

    const result = await getBooksCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: book }
    );

    if (result.matchedCount === 0) {
        ctx.status = 404;
        ctx.body = { error: 'Book not found' };
        return;
    }

    ctx.body = { id };
});

export default router;
