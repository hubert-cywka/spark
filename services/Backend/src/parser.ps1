# Pobranie wszystkich plików *.service.ts w bieżącym folderze i podfolderach
$files = Get-ChildItem -Recurse -Filter "*.service.ts"

foreach ($file in $files) {
    # Wyciągnięcie bazowej nazwy (np. "DomainVerifier" z "DomainVerifier.service.ts")
    $baseName = $file.BaseName -replace "\.service$", ""
    $oldClassName = $baseName + "Service"

    Write-Host "`n--- Plik: $($file.Name) ---" -ForegroundColor Cyan
    $choice = Read-Host "Czy zostawić przyrostek 'Service' w nazwie? (y - zostaw / n - usuń / s - pomiń plik)"

    if ($choice -eq 's') {
        Write-Host "Pominięto." -ForegroundColor Gray
        continue
    }

    if ($choice -eq 'y') {
        $newNamePart = $baseName + "Service"
        $newClassName = $baseName + "Service"
    } else {
        $newNamePart = $baseName
        $newClassName = $baseName
    }

    $newFileName = "$newNamePart.ts"
    $newFilePath = Join-Path $file.DirectoryName $newFileName

    # 1. Zmiana nazwy klasy w kodzie (np. DomainVerifierService -> DomainVerifier)
    # Używamy \b, aby uniknąć przypadkowej podmiany fragmentów innych słów
    (Get-Content $file.FullName) -replace "\b$oldClassName\b", $newClassName | Set-Content $file.FullName

    # 2. Zmiana nazwy pliku
    if ($file.Name -ne $newFileName) {
        Rename-Item -Path $file.FullName -NewName $newFileName
        Write-Host "Zmieniono: $($file.Name) -> $newFileName" -ForegroundColor Green
        Write-Host "Klasa: $oldClassName -> $newClassName" -ForegroundColor Green
    } else {
        Write-Host "Nazwa pliku pozostaje bez zmian." -ForegroundColor Yellow
    }
}

Write-Host "`nOperacja zakończona." -ForegroundColor Magenta