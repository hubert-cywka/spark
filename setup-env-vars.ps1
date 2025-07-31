$repositoryPath = Get-Location

$filePatterns = @(
    @("*.env-default", "*.env"),
    @("*.tfvars.default", "*.tfvars")
)

Write-Host "Setting up environment variables in $($repositoryPath)..."

foreach ($pattern in $filePatterns) {
    $sourcePattern = $pattern[0]
    $destinationExtension = $pattern[1]

    Write-Host "---"
    Write-Host "Searching for files matching '$($sourcePattern)' pattern."

    $filesToCopy = Get-ChildItem -Path $repositoryPath -Recurse -Filter $sourcePattern

    if ($filesToCopy.Count -eq 0) {
        Write-Host "No files matching pattern '$($sourcePattern)' has been found."
        continue 
    }

    foreach ($file in $filesToCopy) {
        $sourcePath = $file.FullName
        $newBaseName = $file.BaseName.Replace($sourcePattern.Replace("*", ""), "")
        $destinationFileName = $newBaseName + $destinationExtension.Replace("*", "")
        $destinationPath = Join-Path -Path $file.Directory.FullName -ChildPath $destinationFileName

        try {
            Copy-Item -Path $sourcePath -Destination $destinationPath -Force
            Write-Host "Copied $($sourcePath) to $($destinationPath)"
        }
        catch {
            Write-Error "Failed to copy $($sourcePath): $($_.Exception.Message)"
        }
    }
}

Write-Host "---"
Write-Host "Default environment variables set."
