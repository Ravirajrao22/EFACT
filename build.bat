@echo off
set "PATH=%~dp0.bin;%PATH%"
echo Building EFACT Studio for production...
call "%~dp0.bin\npm.cmd" run build

