$DockerComposeRootDir = "infrastructure/docker"
docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml stop
