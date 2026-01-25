import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';

import { connectToDatabase } from './db';
import routes from './routes';

const app = new Koa();
qs(app);

app.use(cors());
app.use(bodyParser());

const PORT = 3000;

async function startServer() {
    await connectToDatabase();
    app.use(routes.routes());
    app.use(routes.allowedMethods());

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error('Server failed to start:', err);
    process.exit(1);
});
