@echo off
set "PATH=%~dp0.bin;%PATH%"
echo Starting EFACT Studio development server...
call "%~dp0.bin\npm.cmd" run dev

