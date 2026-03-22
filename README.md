# McMasterful Books — Assignment 7

This version upgrades Assignment 6 into a small monorepo with separated services, independent databases, and RabbitMQ-based messaging.

## Services
- `services/listings-api` — manages the book catalogue and keeps a local cached `stock` value for each book
- `services/warehouse-api` — manages shelf placement and keeps a local cache of book names
- `services/orders-api` — manages orders and keeps a local cache of valid book ids
- `services/docs-server` — serves the combined Swagger/OpenAPI document

## Infrastructure
- Nginx reverse proxy on `http://localhost:8080`
- RabbitMQ on `amqp://localhost:5672` and management UI on `http://localhost:15672`
- One MongoDB instance per API service

## Run the project
```bash
bash ./generate-openapi.sh
docker compose up
```

Then open:
- Frontend: `http://localhost:8080`
- Swagger docs: `http://localhost:8080/api/docs`
- OpenAPI JSON: `http://localhost:8080/api/openapi.json`

## Notes
- The services do not call each other directly.
- Synchronization happens through RabbitMQ events.
- Book creation publishes `BookAdded`.
- Shelf changes publish `BookStockChanged`.
- Order fulfillment publishes `OrderFulfilled`.
