# 🆘 Guia de Solução - Erro 404 NOT_FOUND

## 🎯 **Problema Identificado**
O erro `404: NOT_FOUND` geralmente indica que:
- ❌ MongoDB não está configurado/conectado
- ❌ As APIs não estão funcionando
- ❌ Banco de dados não foi criado

## 🚀 **Solução Rápida - MongoDB Atlas (Recomendado)**

### **Passo 1: Criar Conta MongoDB Atlas**
1. Acesse: https://www.mongodb.com/atlas
2. Clique em "Try Free"
3. Crie uma conta gratuita
4. Crie um cluster gratuito (512MB - grátis para sempre)

### **Passo 2: Obter String de Conexão**
1. No Atlas, clique em "Connect"
2. Escolha "Connect your application"
3. Copie a string de conexão
4. Substitua `<password>` pela sua senha
5. Substitua `<dbname>` por `sistema-sos`

### **Passo 3: Configurar .env.development**
Edite o arquivo `.env.development` e adicione:
```env
MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/sistema-sos?retryWrites=true&w=majority
```

## 🛠️ **Alternativa: MongoDB Local**

### **Opção A: Instalar MongoDB**
1. Download: https://www.mongodb.com/try/download/community
2. Instale e inicie o serviço
3. Use: `MONGODB_URI=mongodb://localhost:27017/sistema-sos`

### **Opção B: Docker (Mais Fácil)**
```bash
# Execute no terminal
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## ⚡ **Teste Rápido**

Após configurar, teste se está funcionando:

1. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Teste a API:**
   ```bash
   # Abra em outro terminal
   curl http://localhost:3000/api/pessoas
   ```

3. **Ou acesse no browser:**
   ```
   http://localhost:3000/api/pessoas
   ```

## 🔧 **Debug Adicional**

Se ainda não funcionar, verifique:

1. **Terminal do servidor** - deve mostrar:
   ```
   ✓ Ready in 2.3s
   - Local: http://localhost:3000
   ```

2. **Console do browser** (F12) - verificar erros JavaScript

3. **Network tab** - verificar se as requisições estão falhando

## 🎯 **Resultado Esperado**

Após configurar corretamente:
- ✅ API `/api/pessoas` deve retornar `[]` (array vazio)
- ✅ Página principal deve carregar sem erro 404
- ✅ Botão "+" deve abrir modal de cadastro
- ✅ Sistema deve aceitar cadastro de pessoas

## 🚨 **Ainda com problemas?**

Execute este comando para diagnóstico:
```bash
# No terminal do projeto
node -e "console.log('MongoDB URI:', process.env.MONGODB_URI || 'MISSING')"
```
