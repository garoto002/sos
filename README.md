# Sistema SOS - Pessoas Perdidas e Achadas

Um sistema moderno e responsivo para reportar e encontrar pessoas perdidas, desenvolvido com Next.js 14 e design mobile-first.

## 🚀 Características

### 📱 **Interface Mobile Premium**
- **Status sempre visível** na tela principal
- **Touch interface otimizada** com ícones grandes e intuitivos
- **Design glassmorphism** com gradientes modernos
- **Animações suaves** e feedback visual
- **Carrossel automático** das pessoas cadastradas

### 🎯 **Funcionalidades Principais**
- ✅ **Cadastro de pessoas** perdidas ou encontradas
- 🔄 **Alteração de status** em tempo real
- 🗺️ **Integração com mapas** para localização
- 💬 **Sistema de comentários** e relatos
- 🔍 **Busca e filtros** avançados
- 📱 **Totalmente responsivo** (mobile-first)

### 🛠️ **Tecnologias**
- **Next.js 14** - Framework React
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **Tailwind CSS** - Estilização e responsividade
- **React Leaflet** - Mapas interativos
- **Next-Auth** - Autenticação

## 🎨 **Design Mobile**

### **Tela Principal:**
- **Foto em tela cheia** da pessoa
- **Status em destaque** no topo (PERDIDO/ENCONTRADO)
- **Nome e descrição** sempre visíveis
- **Ícones touch** para mais informações

### **Ícones Mobile:**
- 👤 **Detalhes** - Nome completo, data, local
- 👕 **Aparência** - Roupas e características físicas  
- 📍 **Mapa** - Localização no mapa interativo
- 📞 **Contato** - Informações para contato
- 💬 **Relatos** - Comentários e atualizações
- ✖ **Fechar** - Esconder opções

## 🚀 **Como Executar**

### **Pré-requisitos:**
- Node.js 18+
- MongoDB (local ou remoto)

### **Instalação:**
```bash
# Clone o repositório
git clone https://github.com/garoto002/sos.git
cd sos

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Execute o servidor de desenvolvimento
npm run dev
```

### **Variáveis de Ambiente:**
```env
MONGODB_URI=sua_string_de_conexao_mongodb
NEXTAUTH_SECRET=seu_secret_aqui
NEXTAUTH_URL=http://localhost:3000
```

## 📦 **Estrutura do Projeto**

```
sistema-sos/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   │   └── pessoas/       # CRUD de pessoas
│   ├── components/        # Componentes React
│   └── page.js           # Página principal
├── models/                # Modelos Mongoose
├── utils/                # Utilitários
└── public/               # Arquivos estáticos
```

## 🎯 **API Endpoints**

- `GET /api/pessoas` - Listar todas as pessoas
- `POST /api/pessoas` - Cadastrar nova pessoa
- `PUT /api/pessoas/[id]/status` - Alterar status
- `POST /api/pessoas/[id]/comentario` - Adicionar comentário

## 🤝 **Contribuição**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 **Sistema SOS**

> **Ajudando a reunir famílias e salvar vidas através da tecnologia.**

---

**Desenvolvido com ❤️ para ajudar a comunidade**
