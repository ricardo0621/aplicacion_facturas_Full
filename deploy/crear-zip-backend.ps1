# Script para crear ZIP del Backend para Dongee
# Excluye node_modules, .env, logs y archivos innecesarios

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Preparando Backend para Dongee" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "Backend")) {
    Write-Host "ERROR: No se encuentra la carpeta Backend" -ForegroundColor Red
    Write-Host "Ejecuta este script desde la raiz del proyecto (d:\nuevo_facturas)" -ForegroundColor Yellow
    exit 1
}

# Crear carpeta temporal
$tempFolder = "deploy\backend_temp"
if (Test-Path $tempFolder) {
    Remove-Item $tempFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $tempFolder -Force | Out-Null

Write-Host "Copiando archivos necesarios..." -ForegroundColor Yellow

# Copiar archivos principales
Copy-Item "Backend\server.js" "$tempFolder\" -Force
Copy-Item "Backend\package.json" "$tempFolder\" -Force
Copy-Item "Backend\db.js" "$tempFolder\" -Force

# Copiar carpetas necesarias
$folders = @("controller", "middlewares", "routes", "services", "sql")
foreach ($folder in $folders) {
    if (Test-Path "Backend\$folder") {
        Copy-Item "Backend\$folder" "$tempFolder\" -Recurse -Force
        Write-Host "  ✓ Copiado: $folder" -ForegroundColor Green
    }
}

# Crear archivo .gitignore para el deploy
$gitignoreContent = @"
node_modules/
.env
*.log
logs/
.DS_Store
"@
Set-Content -Path "$tempFolder\.gitignore" -Value $gitignoreContent

Write-Host ""
Write-Host "Creando archivo ZIP..." -ForegroundColor Yellow

# Crear ZIP
$zipPath = "deploy\backend-dongee.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -Force

# Limpiar carpeta temporal
Remove-Item $tempFolder -Recurse -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ ZIP CREADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ubicación: $zipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "1. Sube este ZIP a cPanel File Manager" -ForegroundColor White
Write-Host "2. Navega a /home3/clinica2/" -ForegroundColor White
Write-Host "3. Crea la carpeta 'facturas-api'" -ForegroundColor White
Write-Host "4. Entra a esa carpeta" -ForegroundColor White
Write-Host "5. Sube el ZIP" -ForegroundColor White
Write-Host "6. Haz clic derecho en el ZIP > Extract" -ForegroundColor White
Write-Host "7. Elimina el ZIP después de extraer" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
