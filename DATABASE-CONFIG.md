# 🔧 Configuração do Banco de Dados - Sistema SOS

## 🚀 Opções de Banco de Dados

### **Opção 1: MongoDB Local**
Se você tem MongoDB instalado localmente:
```env
MONGODB_URI=mongodb://localhost:27017/sistema-sos
```

### **Opção 2: MongoDB Atlas (Cloud) - Recomendado**
Para usar o MongoDB gratuito na nuvem:

1. **Acesse:** https://www.mongodb.com/atlas
2. **Crie uma conta gratuita**
3. **Crie um cluster gratuito**
4. **Obtenha a string de conexão**
5. **Adicione ao .env.development:**

```env
MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/sistema-sos?retryWrites=true&w=majority
```

### **Opção 3: MongoDB Docker**
Se preferir usar Docker:

```bash
# Execute este comando no terminal
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

```env
MONGODB_URI=mongodb://localhost:27017/sistema-sos
```

## 🔍 Testando a Conexão

Para verificar se o MongoDB está funcionando, execute:

```bash
# Para MongoDB local
mongosh

# Para testar a API
curl http://localhost:3001/api/pessoas
```

## ⚠️ Problemas Comuns

### **404 NOT_FOUND**
**Causa:** Banco de dados não configurado
**Solução:** Configure o MONGODB_URI no .env.development

### **Connection Refused**
**Causa:** MongoDB não está rodando
**Soluções:**
1. Instale MongoDB local
2. Use MongoDB Atlas
3. Use Docker

### **Authentication Failed**
**Causa:** Credenciais incorretas
**Solução:** Verifique usuário/senha no MongoDB Atlas

## 🎯 Configuração Recomendada

Para desenvolvimento rápido, recomendo **MongoDB Atlas**:
- ✅ Gratuito até 512MB
- ✅ Sem instalação
- ✅ Funciona de qualquer lugar
- ✅ Backup automático

## 🚀 Próximos Passos

1. Configure o MONGODB_URI
2. Reinicie o servidor: `npm run dev`
3. Teste: http://localhost:3001/api/pessoas
4. Cadastre a primeira pessoa no sistema
