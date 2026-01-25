import Router from '@koa/router';
import { ObjectId } from 'mongodb';
import { getBooksCollection } from '../db';

const router = new Router();

router.delete('/books/:id', async (ctx) => {
    const { id } = ctx.params;

    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid book ID' };
        return;
    }

    const result = await getBooksCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        ctx.status = 404;
        ctx.body = { error: 'Book not found' };
        return;
    }

    ctx.status = 204;
});

export default router;
