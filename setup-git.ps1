# Setup Git para Sistema SOS
# Execute este script no PowerShell

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "    Setup Git para Sistema SOS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
Set-Location "c:\Users\Djedje\Downloads\SOS\sistema-gestao-empresarial-main"

Write-Host "📁 Diretório atual: $(Get-Location)" -ForegroundColor Yellow

Write-Host "🔧 Inicializando repositório Git..." -ForegroundColor Green
git init

Write-Host "🗑️ Removendo remote origin anterior (se existir)..." -ForegroundColor Yellow
git remote remove origin 2>$null

Write-Host "🔗 Adicionando repositório remoto..." -ForegroundColor Green
git remote add origin https://github.com/garoto002/sos.git

Write-Host "🌿 Configurando branch principal..." -ForegroundColor Green
git branch -M main

Write-Host "📦 Adicionando arquivos..." -ForegroundColor Green
git add .

Write-Host "💾 Fazendo commit inicial..." -ForegroundColor Green
git commit -m "🆘 Sistema SOS - Implementação inicial

✨ Features implementadas:
- 📱 Interface mobile-first totalmente responsiva  
- 🎯 Status sempre visível na tela principal
- 🖱️ Touch interface com ícones otimizados
- 🎨 Design glassmorphism moderno
- ⚡ Carrossel automático de pessoas
- 🔄 Sistema de alteração de status em tempo real
- 🗺️ Integração com mapas (Leaflet)
- 💬 Sistema de comentários e relatos
- 🔍 Busca e filtros avançados

🛠️ Stack técnica:
- Next.js 14 com App Router
- MongoDB + Mongoose  
- Tailwind CSS
- React Leaflet"

Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Green
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "    ✅ Setup concluído com sucesso!" -ForegroundColor Green  
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Repositório disponível em:" -ForegroundColor Cyan
    Write-Host "https://github.com/garoto002/sos" -ForegroundColor Blue
} else {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "    ⚠️ Erro na autenticação" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Soluções possíveis:" -ForegroundColor Yellow
    Write-Host "1. Use GitHub Desktop" -ForegroundColor White
    Write-Host "2. Configure Personal Access Token" -ForegroundColor White  
    Write-Host "3. Use SSH keys" -ForegroundColor White
    Write-Host "4. Faça login no GitHub via browser" -ForegroundColor White
}

Write-Host ""
Read-Host "Pressione Enter para continuar"
