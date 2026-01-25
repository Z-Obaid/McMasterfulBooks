import Router from '@koa/router';
import listRouter from './list';
import createRouter from './create';
import deleteRouter from './delete';

const router = new Router();

router.use(listRouter.routes());
router.use(createRouter.routes());
router.use(deleteRouter.routes());

export default router;
