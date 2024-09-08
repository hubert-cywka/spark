# Microservices Architecture Boilerplate (WIP)

## Running locally
`services.up.ps1` script is our entrypoint. It allows to run all services, dockerized or not. By default, all services specified in [docker-compose.yml](./docker-compose.yml) are dockerized. 
Proxy service acts like a gateway connecting all these services and allowing them to communicate with each other. Useful parameters:
- `--DetachedServices` allows to specify list of services to run locally. In order to enable communication of local and dockerized services, add proper configuration in [services.list.json](./services.list.json).
- `--Build` triggers rebuild of all dockerized services.

For example, in order to debug the UI service, you need to:
- make sure that Docker daemon is running on your local machine. This command should run all necessary infrastructure and all services,
- run `pwsh services.up.ps1 --DetachedServices ui-service` (add `--Build` flag if you run the app for the first time),
- go to UI service and start it manually - `npm run dev`. 

By default, UI service starts on port 5173 and Proxy service starts on port 5000.
However, Proxy service redirects to UI service - therefore, if you did everything correctly, after visiting http://localhost:5000 you should see the client app.

## Setting up new services
In order to add a new service, you need to:
- create new service in [services](./services) directory, technology is up to you,
- create Dockerfile the in root of that service (example -> [Dockerfile](./services/UI/Dockerfile)),
- update [docker-compose.yml](./docker-compose.yml) with basic configuration of the new service,
- configure ports and env variables for new service in [docker-compose.local.yml](./docker-compose.local.yml),
- update [services.list.json](./services.list.json) and specify port on which this particular service runs locally (outside the docker container),
- if necessary, configure routes and clusters in [the Proxy service configuration](./services/Proxy/config.yaml).

If you've completed all above steps, you should be able to run the new service both dockerized and detached.
