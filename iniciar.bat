@echo off
cd /d "%~dp0"
echo Abra http://localhost:3000 no Chrome ou Edge.
echo Mantenha esta janela aberta enquanto joga. Ctrl+C encerra o servidor.
python -m http.server 3000 --bind 127.0.0.1
pause
