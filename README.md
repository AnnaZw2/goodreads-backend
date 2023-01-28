<!-- @format -->

# Goodreads - Backend

## Development

To start enviroment:

In root project directory:

- start mongodb and mqtt in docker `docker compose up`
- start backend application `cd src; npm run start` (with node not nodemon)
- load initial data to mongo db `../scripts/load_data.sh`
- mongo is installed with admin interface on http://localhost:8081 (can be changed in `docker-compose.yml` file)
- to stop mongo and mqtt run `docker compose down` - in root project directory

Configuration:

Directory `src`

- `.env.defaults` has default suitable for development
- `.env` - can be used to override default values.

Directory `root project`

- `env` - vars for load data & other

# API design

Current API is described in `route.rest`. This file can be used directly by VSCode plugin `REST Client` to interact with API from inside VSCode.

# Tests

Run tests with `npm test` in `src` directory. This will run tests from `features` directory. Test are written using BDD (behavioural driven development) approach using `cucumber-js` and `pactum` for API testing. API tests are written in natural English in `*.feature` files

For examaple:

```
    Scenario: Get comments
        Given I make a "GET" request to "/comments"
        When I receive a response
        Then I expect response should have a status 200
        And I expect response should have a json like
            """
            [
            {
            "book_id": $S{BookId},
            }
            ]
            """
```
