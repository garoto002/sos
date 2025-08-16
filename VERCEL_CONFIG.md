# Configuração das variáveis de ambiente no Vercel

## No dashboard do Vercel:
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto 'sos'
3. Vá em Settings > Environment Variables
4. Adicione as seguintes variáveis:

### Variáveis obrigatórias:
NEXTAUTH_SECRET=DaViDFiLiPegEge
NEXTAUTH_URL=https://seu-projeto.vercel.app
MONGODB_URI=mongodb+srv://davidgege07:david00002@cluster0.gsernpa.mongodb.net/SOS

### Importante:
- Substitua "seu-projeto.vercel.app" pela URL real do seu projeto
- Certifique-se de que o MongoDB Atlas está configurado para aceitar conexões de qualquer IP (0.0.0.0/0)
- Após adicionar as variáveis, faça um novo deploy

## Verificar no MongoDB Atlas:
1. Acesse: https://cloud.mongodb.com/
2. Vá em Network Access
3. Adicione IP 0.0.0.0/0 (Allow access from anywhere)
4. Verifique se o usuário 'davidgege07' tem permissões de leitura/escrita
