@echo off
echo ====================================
echo    Setup Git para Sistema SOS
echo ====================================
echo.

cd /d "c:\Users\Djedje\Downloads\SOS\sistema-gestao-empresarial-main"

echo Inicializando repositório Git...
git init

echo Removendo remote origin anterior (se existir)...
git remote remove origin 2>nul

echo Adicionando repositório remoto...
git remote add origin https://github.com/garoto002/sos.git

echo Configurando branch principal...
git branch -M main

echo Adicionando arquivos...
git add .

echo Fazendo commit inicial...
git commit -m "🆘 Sistema SOS - Implementação inicial com interface mobile responsiva"

echo Enviando para GitHub...
git push -u origin main

echo.
echo ====================================
echo    Setup concluído!
echo ====================================
echo.
echo Para verificar o repositório:
echo https://github.com/garoto002/sos
echo.
echo Se houve erro de autenticação:
echo 1. Use GitHub Desktop
echo 2. Configure Personal Access Token
echo 3. Use SSH keys
echo.
pause
