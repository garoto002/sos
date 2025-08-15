# 🚀 Instruções para Conectar ao GitHub

## ⚡ Scripts Automáticos

### **Opção A: PowerShell (Recomendado)**
1. Clique direito na pasta do projeto
2. Selecione "Abrir no Terminal" ou "PowerShell aqui"
3. Execute: `.\setup-git.ps1`

### **Opção B: Batch Script**
1. Duplo-clique em `setup-git.bat`

## 📝 Comandos Manuais (se scripts não funcionarem)

```bash
# 1. Navegar para a pasta
cd "c:\Users\Djedje\Downloads\SOS\sistema-gestao-empresarial-main"

# 2. Inicializar Git
git init

# 3. Remover remote anterior (se existir)
git remote remove origin

# 4. Adicionar novo remote
git remote add origin https://github.com/garoto002/sos.git

# 5. Configurar branch principal
git branch -M main

# 6. Adicionar arquivos
git add .

# 7. Commit inicial
git commit -m "🆘 Sistema SOS - Implementação inicial"

# 8. Push para GitHub
git push -u origin main
```

## 🔧 Problemas Comuns

### **❌ "error: remote origin already exists"**
**Solução:** Execute primeiro:
```bash
git remote remove origin
```

### **🔒 Erro de autenticação**
**Soluções:**
1. **GitHub Desktop** - Mais fácil para iniciantes
2. **Personal Access Token** - No lugar da senha
3. **SSH Keys** - Mais seguro
4. **GitHub CLI** - `gh auth login`

### **⚠️ "fatal: not a git repository"**
**Solução:**
```bash
git init
```

## 🎯 O que será enviado para o GitHub:

```
sistema-sos/
├── app/                    # App Router Next.js
│   ├── api/pessoas/       # API de pessoas
│   ├── components/        # Componentes React
│   ├── page.js           # Página principal
│   └── globals.css       # Estilos globais
├── models/                # Modelos MongoDB
├── utils/                # Utilitários
├── public/               # Arquivos públicos
├── package.json          # Dependências
├── README.md            # Documentação
├── .gitignore           # Arquivos ignorados
└── setup-git.bat        # Script de setup
```

## 🎯 Features que serão enviadas:

- ✅ Interface mobile responsiva
- ✅ Status sempre visível
- ✅ Sistema de comentários
- ✅ Integração com mapas
- ✅ Carrossel automático
- ✅ Design glassmorphism
- ✅ Touch interface otimizada
- ✅ API REST completa
- ✅ Animações customizadas
