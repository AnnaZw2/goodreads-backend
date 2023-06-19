<!-- @format -->

# Goodreads - Backend
Projekt na bezpieczeństwo aplikacji webowych  znajduje się na branchu bezpieczeństwo apllikacji.

## Development

To start enviroment:

In root project directory:

- start mongodb and mqtt in docker `docker compose up`
- start backend application `cd src; npm run start` (with node not nodemon)
- load initial data to mongo db `../scripts/load_data.sh`
- mongo is installed with admin interface on http://localhost:8081 (can be changed in `docker-compose.yml` file)
- to stop mongo and mqtt run `docker compose down` - in root project directory
- keycloak is starting on http://0.0.0.0:8080/

Configuration:

Directory `src`

- `.env.defaults` has default suitable for development
- `.env` - can be used to override default values.

Directory `root project`

- `env` - vars for load data & other


