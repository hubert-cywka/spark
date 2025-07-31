# Local development

## Prerequisites
`npm` is required for local development. If you just want to run all services in docker, you don't have to
install it. [See how to install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

`@swc/cli` and `@nest/cli` are required to run backend services in debug mode, but if you want to just run the app in 
Docker, you don't have to install these dependencies. 

To install them, you need to run the following commands (assuming you have `npm` installed):
- `npm install -g @swc/cli` <br/>
- `npm install -g @nest/cli` <br/>

## Running locally
`npm run start` is our entrypoint. It executes a script which allows to run all services, dockerized or not. By default, all services specified in [docker-compose.yml](./docker-compose.yml) are dockerized.

For example, in order to run the Frontend locally and other services in containers, you need to:
- make sure that Docker daemon is running on your local machine. This command should run all necessary infrastructure and all services,
- in the repository's root, run `npm run start -- --DetachedServices ui-service` (add `--Build` flag if you run the app 
  for the first time),
- go to UI service (`cd services/Frontend`) and start it manually - `npm run dev`.

By default, Frontend starts on port 5100 and Gateway starts on port 5000.
Proxy service redirects to UI service - therefore, if you did everything correctly, after visiting http://localhost:5000 you should see the client app.

### Running all services in Docker with `npm`
Go to repository's root and run `npm run start --Build`.

### Running all services in Docker without `npm`
Go to repository's root and run `pwsh ./scripts/services.up.ps1 --Build`.

## Scripts
- `npm run start` - runs all services with necessary infrastructure. Accepts two parameters (prepend the params with 
  `--`, e.g. `npm run start -- --Param1 value --Param2 value`:
    - `Build` - optional flag, set to trigger rebuild of all docker images,
    - `DetachedServices` - optional, comma separated list of services to run on local machine (not containerized), e.g. `service-a,service-b`. If not provided, all services are containerized.
  
- `npm run stop` - stops all containers.
