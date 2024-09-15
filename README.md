# Microservices Architecture Boilerplate (WIP)

## Scripts
- `npm run start` - runs all services with necessary infrastructure. Accepts 2 parameters (prepend the params with `--`, e.g. `npm run start -- -Param1 value -Param2 value`:
    - `-Build` - optional flag, set to trigger rebuild of all docker images,
    - `-DetachedServices` - optional, comma separated list of services to run on local machine (not containerized), e.g. `service-a,service-b`. If not provided, all services are containerized.
- `npm run debug-package` - builds a package and copies dist to `node_modules` of selected service. Interactive, doesn't accept any parameters.

## Running locally
`npm run start` is our entrypoint. It executes a script which allows to run all services, dockerized or not. By default, all services specified in [docker-compose.yml](./docker-compose.yml) are dockerized. 

For example, in order to run the UI service locally and other services in containers, you need to:
- make sure that Docker daemon is running on your local machine. This command should run all necessary infrastructure and all services,
- run `npm run start -- --DetachedServices ui-service` (add `--Build` flag if you run the a pp for the first time),
- go to UI service and start it manually - `npm run dev`. 

By default, UI service starts on port 5173 and Proxy service starts on port 5000.
However, Proxy service redirects to UI service - therefore, if you did everything correctly, after visiting http://localhost:5000 you should see the client app.

## Setting up new services
In order to add a new service, you need to:
- create new service in [services](./services) directory, technology is up to you,
- create Dockerfile the in root of that service (example -> [Dockerfile](./services/UI/Dockerfile)),
- update [docker-compose.yml](./infrastructure/docker/docker-compose.yml) with basic configuration of the new service,
- configure ports and env variables for new service in [docker-compose.local.yml](./infrastructure/docker/docker-compose.local.yml),
- update [services.list.json](./infrastructure/services.list.json) and specify port on which this particular service runs locally (outside the docker container),
- if necessary, configure routes and clusters in [the Proxy service configuration](./services/Proxy/config.yaml) and [the Stitching service](./services/Stitching/src/graphql/graphql-gateway.module.ts).

If you've completed all above steps, you should be able to run the new service both dockerized and detached.
