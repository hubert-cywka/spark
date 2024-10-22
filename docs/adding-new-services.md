# Adding new services
In order to add a new service, you need to:
- create new service in [services](../services) directory, technology is up to you,
- create Dockerfile the in root of that service (example -> [Dockerfile](../services/UI/Dockerfile)),
- update [docker-compose.yml](../infrastructure/docker/docker-compose.yml) with basic configuration of the new service,
- configure ports and env variables for new service in [docker-compose.local.yml](../infrastructure/docker/docker-compose.local.yml),
- update env variables in [.tfvars-default](../infrastructure/terraform/terraform.tfvars.default), [variables.tf](../infrastructure/terraform/variables.tf), [kubernetes_config_map](../infrastructure/terraform/main.tf),
- add new terraform resource in [terraform directory](../infrastructure/terraform),
- update [services.list.json](../infrastructure/services.list.json) and specify port on which this particular service runs locally (outside the docker container),
- if necessary, configure routes and clusters in [the Proxy service configuration](../services/Proxy/config.yaml) and [the Stitching service](../services/Stitching/src/graphql/GraphQLGateway.module.ts).

If you've completed all above steps, you should be able to run the new service both dockerized and detached.
