/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WarehouseRoute } from './../src/warehouse.route';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrdersRoute } from './../src/orders.route';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BooksRoute } from './../src/books.route';
import type { Context, Next, Middleware, Request as KRequest, Response as KResponse } from 'koa';
import type * as KoaRouter from '@koa/router';


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "PlaceBooksRequest": {
        "dataType": "refObject",
        "properties": {
            "bookId": {"dataType":"string","required":true},
            "numberOfBooks": {"dataType":"double","required":true},
            "shelf": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ShelfStockDto": {
        "dataType": "refObject",
        "properties": {
            "shelf": {"dataType":"string","required":true},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderDto": {
        "dataType": "refObject",
        "properties": {
            "orderId": {"dataType":"string","required":true},
            "books": {"ref":"Record_string.number_","required":true},
            "fulfilled": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "books": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FulfillmentItem": {
        "dataType": "refObject",
        "properties": {
            "book": {"dataType":"string","required":true},
            "shelf": {"dataType":"string","required":true},
            "numberOfBooks": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "author": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "image": {"dataType":"string","required":true},
            "stock": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FilterInput": {
        "dataType": "refObject",
        "properties": {
            "from": {"dataType":"double"},
            "to": {"dataType":"double"},
            "name": {"dataType":"string"},
            "author": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


export function RegisterRoutes(router: KoaRouter) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


        const argsWarehouseRoute_placeBooks: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"PlaceBooksRequest"},
        };
        router.post('/warehouse/shelves',
            ...(fetchMiddlewares<Middleware>(WarehouseRoute)),
            ...(fetchMiddlewares<Middleware>(WarehouseRoute.prototype.placeBooks)),

            async function WarehouseRoute_placeBooks(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseRoute_placeBooks, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new WarehouseRoute();

            return templateService.apiHandler({
              methodName: 'placeBooks',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWarehouseRoute_locations: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        router.get('/warehouse/books/:bookId/locations',
            ...(fetchMiddlewares<Middleware>(WarehouseRoute)),
            ...(fetchMiddlewares<Middleware>(WarehouseRoute.prototype.locations)),

            async function WarehouseRoute_locations(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseRoute_locations, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new WarehouseRoute();

            return templateService.apiHandler({
              methodName: 'locations',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWarehouseRoute_stock: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        router.get('/warehouse/books/:bookId/stock',
            ...(fetchMiddlewares<Middleware>(WarehouseRoute)),
            ...(fetchMiddlewares<Middleware>(WarehouseRoute.prototype.stock)),

            async function WarehouseRoute_stock(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseRoute_stock, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new WarehouseRoute();

            return templateService.apiHandler({
              methodName: 'stock',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersRoute_listOrders: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/orders',
            ...(fetchMiddlewares<Middleware>(OrdersRoute)),
            ...(fetchMiddlewares<Middleware>(OrdersRoute.prototype.listOrders)),

            async function OrdersRoute_listOrders(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersRoute_listOrders, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersRoute();

            return templateService.apiHandler({
              methodName: 'listOrders',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersRoute_getOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
        };
        router.get('/orders/:orderId',
            ...(fetchMiddlewares<Middleware>(OrdersRoute)),
            ...(fetchMiddlewares<Middleware>(OrdersRoute.prototype.getOrder)),

            async function OrdersRoute_getOrder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersRoute_getOrder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersRoute();

            return templateService.apiHandler({
              methodName: 'getOrder',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersRoute_createOrder: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"CreateOrderRequest"},
        };
        router.post('/orders',
            ...(fetchMiddlewares<Middleware>(OrdersRoute)),
            ...(fetchMiddlewares<Middleware>(OrdersRoute.prototype.createOrder)),

            async function OrdersRoute_createOrder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersRoute_createOrder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersRoute();

            return templateService.apiHandler({
              methodName: 'createOrder',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersRoute_fulfillOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"fulfillment":{"dataType":"array","array":{"dataType":"refObject","ref":"FulfillmentItem"},"required":true}}},
        };
        router.post('/orders/:orderId/fulfill',
            ...(fetchMiddlewares<Middleware>(OrdersRoute)),
            ...(fetchMiddlewares<Middleware>(OrdersRoute.prototype.fulfillOrder)),

            async function OrdersRoute_fulfillOrder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersRoute_fulfillOrder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersRoute();

            return templateService.apiHandler({
              methodName: 'fulfillOrder',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksRoute_listBooks: Record<string, TsoaRoute.ParameterSchema> = {
                _query: {"in":"queries","name":"_query","ref":"FilterInput"},
        };
        router.get('/books',
            ...(fetchMiddlewares<Middleware>(BooksRoute)),
            ...(fetchMiddlewares<Middleware>(BooksRoute.prototype.listBooks)),

            async function BooksRoute_listBooks(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksRoute_listBooks, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksRoute();

            return templateService.apiHandler({
              methodName: 'listBooks',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksRoute_getBook: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        router.get('/books/:id',
            ...(fetchMiddlewares<Middleware>(BooksRoute)),
            ...(fetchMiddlewares<Middleware>(BooksRoute.prototype.getBook)),

            async function BooksRoute_getBook(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksRoute_getBook, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksRoute();

            return templateService.apiHandler({
              methodName: 'getBook',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksRoute_createOrUpdateBook: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"BookDto"},
        };
        router.post('/books',
            ...(fetchMiddlewares<Middleware>(BooksRoute)),
            ...(fetchMiddlewares<Middleware>(BooksRoute.prototype.createOrUpdateBook)),

            async function BooksRoute_createOrUpdateBook(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksRoute_createOrUpdateBook, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksRoute();

            return templateService.apiHandler({
              methodName: 'createOrUpdateBook',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksRoute_deleteBook: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        router.delete('/books/:id',
            ...(fetchMiddlewares<Middleware>(BooksRoute)),
            ...(fetchMiddlewares<Middleware>(BooksRoute.prototype.deleteBook)),

            async function BooksRoute_deleteBook(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksRoute_deleteBook, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksRoute();

            return templateService.apiHandler({
              methodName: 'deleteBook',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
