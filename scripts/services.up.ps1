Param(
    [Parameter(HelpMessage = "List of services to detach and run manually")][String[]]
    $DetachedServices,
    [switch]
    $Build
)

function Build-EnvVar {
    param ($value)
    return "      - $value`n"
}

function Update-Or-Add-EnvVariable {
    param (
        [ref]$envList,
        $newEnvVariable
    )

    $envKey = $newEnvVariable.Split("=")[0]
    $existingIndex = -1

    for ($i = 0; $i -lt $envList.Value.Count; $i++) {
        $existingKey = $envList.Value[$i].Split("=")[0]
        if ($existingKey -eq $envKey) {
            $existingIndex = $i
            break
        }
    }

    if ($existingIndex -ge 0) {
        $envList.Value[$existingIndex] = $newEnvVariable
    } else {
        $envList.Value.Add($newEnvVariable)
    }
}

# Shutdown all running containers to ensure smooth start-up
docker kill $(docker ps -q)

# In case DetachedServices param wasn't parsed correctly
$DetachedServices = $DetachedServices -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

# Create docker network if it does not exist
$DockerNetworkName = "services_network"
$ExistingNetwork = docker network ls --filter "name=$DockerNetworkName" --format "{{ .Name }}"
if (-not $ExistingNetwork) {
    docker network create $DockerNetworkName
}

# Get list of all services and detachable ones
$ServicesListJson = Get-Content -Raw -Path "infrastructure/services.list.json" | ConvertFrom-Json

$ServicesList = @{}
$ServicesListJson.PSObject.Properties | ForEach-Object {
    $ServicesList[$_.Name] = $_.Value
}

$DetachableServicesList = $ServicesListJson.PSObject.Properties |
    Where-Object { $_.Value.detachable -eq $true } |
    ForEach-Object { $_.Name }

# Check if DetachedServices contains valid and existing services
$DetachedServicesCheck = 0
foreach ($service in $DetachedServices) {
    if (-not [string]::IsNullOrWhiteSpace($service)) {
        if ($DetachableServicesList -notcontains $service) {
            Write-Error "'$service' does not exist or is not detachable. Check 'services.list.json' for list of available services."
            $DetachedServicesCheck = 1
        } else {
            Write-Output "$service found."
        }
    }
}

if ($DetachedServicesCheck -eq 1) {
    echo "At least one service could not be found. Exiting..."
    Exit
}

$DockerComposeRootDir = "infrastructure/docker"

# If no services were specified to be ran manually, then run all services in containers
if ($DetachedServices.Count -eq 0) {
    if ($Build) {
        docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml up --build -d
    } else {
        docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml up -d
    }
    exit
}


# Get list of services that should be running inside containers anyway
$ServicesListNames = $ServicesListJson.PSObject.Properties | ForEach-Object { $_.Name }
[string[]]$ServicesToRunInContainer = $ServicesListNames | Where-Object { -not ($DetachedServices -contains $_) }

# Prepare powershell-yaml module
if (-not (Get-Module -ListAvailable -Name powershell-yaml)) {
    Install-Module -Name powershell-yaml -Force -AllowClobber
}

Import-Module powershell-yaml

# Create docker-compose.local.override.yml file
# In that file we want to override envoy related envs, so envoy can proxy to services running on host machine.
# Same applies to Stitching service, as it needs to know where are the GraphQL sub-graphs.
$GatewayService = "gateway"
$DockerComposeLocal = Get-Content -Path $DockerComposeRootDir/docker-compose.local.yml | ConvertFrom-Yaml

foreach ($DetachedService in $DetachedServices) {
    $PortValue = $ServicesList[$DetachedService].port
    $EnvNamePrefix = $DetachedService.ToUpper() -replace "-", "_"

    $EnvPort = "$($EnvNamePrefix)_PORT=$($PortValue)"
    $EnvAddress = "$($EnvNamePrefix)_ADDRESS=host.docker.internal"

    Update-Or-Add-EnvVariable -envList ([ref]$DockerComposeLocal.services.$GatewayService.environment) -newEnvVariable $EnvAddress
    Update-Or-Add-EnvVariable -envList ([ref]$DockerComposeLocal.services.$GatewayService.environment) -newEnvVariable $EnvPort
}

$DockerComposeLocal | ConvertTo-Yaml | Out-File -FilePath $DockerComposeRootDir/docker-compose.local.override.yml -Encoding UTF8

if ($Build) {
    docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml -f $DockerComposeRootDir/docker-compose.local.override.yml up $ServicesToRunInContainer --build -d
} else {
    docker-compose -f $DockerComposeRootDir/docker-compose.yml -f $DockerComposeRootDir/docker-compose.local.yml -f $DockerComposeRootDir/docker-compose.local.override.yml services up $ServicesToRunInContainer -d
}
