$organization = "@hcywka"

function List-Packages {
    $packages = Get-ChildItem -Directory -Path "packages/npm/"
    $index = 1
    foreach ($package in $packages) {
        Write-Host "$index. $($package.Name)"
        $index++
    }
    $selection = Read-Host "Select package"
    return $packages[$selection - 1]
}

function List-Services {
    $services = Get-ChildItem -Directory -Path "services/*/node_modules/"
    $index = 1
    foreach ($service in $services) {
        Write-Host "$index. $($service.FullName)"
        $index++
    }
    $selection = Read-Host "Select destination"
    return $services[$selection - 1]
}

function Run-Build($packagePath) {
    Write-Host "Building the package..."
    Set-Location $packagePath
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build the package." -ForegroundColor Red
        exit 1
    }
}

function Copy-Dist($packageName, $nodeModulesPath) {
    $source = "dist"
    $destination = "$nodeModulesPath\$organization\$packageName"

    if (Test-Path $destination) {
        Write-Host "Folder $destination already exists. Removing..."
        Remove-Item $destination -Recurse -Force
        Write-Host "Removed."
    }

    if (Test-Path $source) {
        Write-Host "Copying from $source to $destination"
        New-Item -ItemType Directory -Path $destination -Force
        Copy-Item "$source\*" $destination -Recurse
        Write-Host "Package should be ready."
    } else {
        Write-Host "Failed to copy source files to destination." -ForegroundColor Red
        exit 1
    }
}

$chosenPackage = List-Packages
$packagePath = $chosenPackage.FullName
$chosenServiceNodeModulesPath = List-Services

Run-Build $packagePath
Copy-Dist $chosenPackage.Name $chosenServiceNodeModulesPath.FullName
