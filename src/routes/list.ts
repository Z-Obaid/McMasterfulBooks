import Router from '@koa/router';
import { getBooksCollection } from '../db';

const router = new Router();

router.get('/books', async (ctx) => {
  try {
    const collection = getBooksCollection();

    const filters = ctx.query.filters as
      | Array<{ from?: string; to?: string }>
      | undefined;

    let query: any = {};

    if (filters && Array.isArray(filters) && filters.length > 0) {
      const priceQueries = filters
        .map(filter => {
          const price: any = {};
          if (filter.from !== undefined) {
            const from = Number(filter.from);
            if (!Number.isNaN(from)) price.$gte = from;
          }
          if (filter.to !== undefined) {
            const to = Number(filter.to);
            if (!Number.isNaN(to)) price.$lte = to;
          }
          return Object.keys(price).length > 0 ? { price } : null;
        })
        .filter(Boolean);

      if (priceQueries.length > 0) {
        query = { $or: priceQueries };
      }
    }

    const books = await collection.find(query).toArray();

    ctx.body = books.map(b => ({
      id: b._id.toString(),
      name: b.name,
      author: b.author,
      description: b.description,
      price: b.price,
      image: b.image
    }));
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch books' };
  }
});

export default router;
