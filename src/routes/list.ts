import Router from '@koa/router';
import { getBooksCollection } from '../db';

const router = new Router();

router.get('/books', async (ctx) => {
  try {
    const collection = getBooksCollection();

    const filters = ctx.query.filters as
      | Array<{
          from?: string;
          to?: string;
          name?: string;
          author?: string;
        }>
      | undefined;

    //Remove empty / invalid filters
    const validFilters = filters?.filter(({ from, to, name, author }) =>
      from !== undefined ||
      to !== undefined ||
      (typeof name === 'string' && name.trim().length > 0) ||
      (typeof author === 'string' && author.trim().length > 0)
    ) ?? [];

    //Build MongoDB query
    const query =
      validFilters.length > 0
        ? {
            $or: validFilters.map(({ from, to, name, author }) => {
              const filter: any = {};

              if (from !== undefined || to !== undefined) {
                filter.price = {};
                if (from !== undefined && !Number.isNaN(Number(from))) {
                  filter.price.$gte = Number(from);
                }
                if (to !== undefined && !Number.isNaN(Number(to))) {
                  filter.price.$lte = Number(to);
                }
              }

              if (typeof name === 'string' && name.trim().length > 0) {
                filter.name = { $regex: name.trim(), $options: 'i' };
              }

              if (typeof author === 'string' && author.trim().length > 0) {
                filter.author = { $regex: author.trim(), $options: 'i' };
              }

              return filter;
            })
          }
        : {};

    // Query DB once
    const books = await collection.find(query).toArray();

    // Normalize output
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
