Param(
    [Parameter(HelpMessage = "List of services to detach and run manually")][String[]]
    $DetachedServices,
    [switch]
    $Build
)

# Create docker network if it does not exist
$DockerNetworkName = "services_network"
$ExistingNetwork = docker network ls --filter "name=$DockerNetworkName" --format "{{ .Name }}"
if (-not $ExistingNetwork) {
    docker network create $DockerNetworkName
}

$ServicesList = @();
(Get-Content -Raw -Path infrastructure/services.list.json | ConvertFrom-Json).psobject.Properties.name.ForEach({ $ServicesList += $_.toString() })

$DetachedServicesCheck = 0
# Check if DetachedServices contains valid and existing services
$DetachedServices.foreach({
        if ($ServicesList -notcontains $PSItem) {
            Write-Error "$PSItem service is not found. Check services.list.json for list of available services."
            $DetachedServicesCheck = 1
        } else {
            echo "$PSItem found."
        }
    })

if ($DetachedServicesCheck -eq 1) {
    echo "At least one service could not be found. Exiting..."
    Exit
}

$DockerComposeRootDir = "infrastructure/docker"

# If no services were specified to be ran manually, then run all services in containers
if ($DetachedServices.Count -eq 0) {
    if ($Build) {
        docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml up --build
    } else {
        docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml up
    }
    exit
}

# Get list of services that should be running inside containers anyway
[string[]]$ServicesToRunInContainer = $ServicesList | Where-Object { -not ($DetachedServices -contains $_) }

# Prepare powershell-yaml module
if (-not (Get-Module -ListAvailable -Name powershell-yaml)) {
    Install-Module -Name powershell-yaml -Force -AllowClobber
}

Import-Module powershell-yaml

# Create docker-compose.local.override.yml file
# In that file we want to override envoy related envs, so envoy can proxy to services running on host machine
$ProxyService = "proxy-service"
$DockerComposeLocal = Get-Content -Path $DockerComposeRootDir/docker-compose.local.yml | ConvertFrom-Yaml
$DetachableServicesList = Get-Content -Path infrastructure/services.list.json | ConvertFrom-Json
foreach ($DetachedService in $DetachedServices) {
    $PortValue = $DetachableServicesList.$DetachedService.port
    $EnvNamePrefix = $DetachedService.ToUpper() -replace "-", "_";
    $EnvAddress = "$($EnvNamePrefix)_ADDRESS=host.docker.internal"
    $EnvPort = "$($EnvNamePrefix)_PORT=$($PortValue)"

    $DockerComposeLocal.services.$ProxyService.environment = New-Object System.Collections.ArrayList
    $DockerComposeLocal.services.$ProxyService.environment.Add($EnvAddress)
    $DockerComposeLocal.services.$ProxyService.environment.Add($EnvPort)
}

$DockerComposeLocal | ConvertTo-Yaml | Out-File -FilePath $DockerComposeRootDir/docker-compose.local.override.yml -Encoding UTF8

if ($Build) {
    docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml -f $DockerComposeRootDir/docker-compose.local.override.yml up --build $ServicesToRunInContainer
} else {
    docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml -f $DockerComposeRootDir/docker-compose.local.override.yml up $ServicesToRunInContainer
}
