$env:PATH = "$PSScriptRoot\.bin;" + $env:PATH
Write-Host "Starting EFACT Studio development server..." -ForegroundColor Green
& "$PSScriptRoot\.bin\npm.cmd" run dev

