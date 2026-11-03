@echo off
set "PATH=%~dp0.bin;%PATH%"
echo Starting EFACT Studio preview server...
call "%~dp0.bin\npm.cmd" run preview

