# McMasterfulBooks Assignment 7

This version keeps the Assignment 7 monorepo split while staying close to the earlier McMasterfulBooks structure.

## Services
- `services/listings-api` - book CRUD, Mongo-backed
- `services/warehouse-api` - shelf placement and stock lookup
- `services/orders-api` - order creation and fulfilment
- `services/docs-server` - Swagger docs host
- `rabbitmq` - book event messaging between services
- `nginx` - gateway for the front-end and APIs

## Run
```bash
docker compose up --build
```

Then open:
- Front-end: `http://localhost:8080`
- Docs landing page: `http://localhost:8080/docs`
- RabbitMQ management: `http://localhost:15672`

## Notes
- The front-end uses the adapter files in `adapter/`.
- API routes are exposed through nginx under `/api/...`.
- Book create/update/delete events are published from Listings and consumed by Orders/Warehouse.
