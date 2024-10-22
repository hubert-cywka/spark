# Local development

## Running locally
`npm run start` is our entrypoint. It executes a script which allows to run all services, dockerized or not. By default, all services specified in [docker-compose.yml](./docker-compose.yml) are dockerized.

For example, in order to run the UI service locally and other services in containers, you need to:
- make sure that Docker daemon is running on your local machine. This command should run all necessary infrastructure and all services,
- run `npm run start -- --DetachedServices ui-service` (add `--Build` flag if you run the app for the first time),
- go to UI service and start it manually - `npm run dev`.

By default, UI service starts on port 5173 and Proxy service starts on port 5000.
However, Proxy service redirects to UI service - therefore, if you did everything correctly, after visiting http://localhost:5000 you should see the client app.

## Scripts
- `npm run start` - runs all services with necessary infrastructure. Accepts 2 parameters (prepend the params with `--`, e.g. `npm run start -- -Param1 value -Param2 value`:
    - `-Build` - optional flag, set to trigger rebuild of all docker images,
    - `-DetachedServices` - optional, comma separated list of services to run on local machine (not containerized), e.g. `service-a,service-b`. If not provided, all services are containerized.
  
- `npm run stop` - stops all containers.

- `npm run debug-package` - builds a package and copies dist to `node_modules` of selected service. Interactive, doesn't accept any parameters. Alternatively, you can just use `npm link`.
