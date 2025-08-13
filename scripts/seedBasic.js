const mongoose = require('mongoose');

// Conectar ao MongoDB (ajuste a URL conforme necessário)
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/sistema-gestao-empresarial', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

// Schemas simplificados
const customerSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  location: String,
  address: String,
  phone: String,
  category: String,
  status: { type: String, enum: ['ativo', 'inativo', 'pendente'], default: 'ativo' },
  notes: String,
  nuit: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const supplierSchema = new mongoose.Schema({
  supplierName: String,
  company: String,
  email: String,
  phone: String,
  address: String,
  category: String,
  status: { type: String, enum: ['ativo', 'inativo', 'pendente'], default: 'ativo' },
  country: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  productName: String,
  category: String,
  price: Number,
  quantity: Number,
  description: String,
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const Customer = mongoose.model('Customer', customerSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const Product = mongoose.model('Product', productSchema);

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed dos dados...');

    // 1. Criar 20 clientes
    const customerNames = [
      'João Silva', 'Maria Santos', 'Pedro Machava', 'Ana Cossa', 'Carlos Nhantumbo',
      'Luisa Bila', 'António Mucavel', 'Rosa Tembe', 'Manuel Sitoe', 'Isabel Chuva',
      'Francisco Mabote', 'Graça Mondlane', 'Alberto Chissano', 'Teresa Macamo', 'Sérgio Mabjaia',
      'Beatriz Nguenha', 'Edmundo Galiza', 'Palmira Dique', 'Hélder Mutimucuio', 'Celina Manhiça'
    ];

    const categories = ['Pessoa Física', 'Empresa', 'Microempresa', 'ONG'];
    const locations = ['Maputo', 'Matola', 'Beira', 'Nampula', 'Quelimane', 'Tete', 'Xai-Xai'];

    const customers = [];
    for (let i = 0; i < 20; i++) {
      const customer = {
        customerName: customerNames[i],
        email: `${customerNames[i].toLowerCase().replace(' ', '.')}@email.com`,
        phone: `+258 8${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        address: `Rua ${Math.floor(Math.random() * 50) + 1}, Bairro Central`,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: ['ativo', 'ativo', 'ativo', 'inativo', 'pendente'][Math.floor(Math.random() * 5)],
        nuit: Math.floor(Math.random() * 900000000) + 100000000,
        notes: i % 3 === 0 ? 'Cliente preferencial' : '',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      };
      customers.push(customer);
    }

    await Customer.insertMany(customers);
    console.log('✅ 20 clientes criados');

    // 2. Criar 20 fornecedores
    const supplierNames = [
      'Fornecedor Alpha Lda', 'Beta Suprimentos', 'Gamma Materiais', 'Delta Produtos', 'Epsilon Fornecimentos',
      'Zeta Comercial', 'Eta Distribuidora', 'Theta Suprimentos', 'Iota Materiais', 'Kappa Produtos',
      'Lambda Fornecedor', 'Mu Comercial', 'Nu Distribuidora', 'Xi Suprimentos', 'Omicron Materiais',
      'Pi Produtos', 'Rho Fornecimentos', 'Sigma Comercial', 'Tau Distribuidora', 'Upsilon Suprimentos'
    ];

    const supplierCategories = ['Materiais', 'Tecnologia', 'Alimentação', 'Vestuário', 'Móveis'];
    const countries = ['Moçambique', 'África do Sul', 'Portugal', 'Brasil', 'China'];

    const suppliers = [];
    for (let i = 0; i < 20; i++) {
      const supplier = {
        supplierName: `Fornecedor ${i + 1}`,
        company: supplierNames[i],
        email: `${supplierNames[i].toLowerCase().replace(/\s+/g, '').replace('lda', '')}@empresa.com`,
        phone: `+258 2${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
        address: `Av. Comercial ${Math.floor(Math.random() * 100) + 1}`,
        category: supplierCategories[Math.floor(Math.random() * supplierCategories.length)],
        status: ['ativo', 'ativo', 'ativo', 'inativo', 'pendente'][Math.floor(Math.random() * 5)],
        country: countries[Math.floor(Math.random() * countries.length)],
        notes: i % 4 === 0 ? 'Fornecedor estratégico' : '',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000)
      };
      suppliers.push(supplier);
    }

    await Supplier.insertMany(suppliers);
    console.log('✅ 20 fornecedores criados');

    // 3. Criar 20 produtos
    const productNames = [
      'Notebook Dell', 'Mouse Óptico', 'Teclado Mecânico', 'Monitor 24"', 'Impressora HP',
      'Cadeira Escritório', 'Mesa Executiva', 'Telefone IP', 'Roteador WiFi', 'Switch 8 Portas',
      'Projetor HD', 'Tela Projeção', 'Cabo HDMI', 'Pendrive 32GB', 'HD Externo 1TB',
      'Webcam HD', 'Headset Bluetooth', 'Tablet Android', 'Smartphone', 'Carregador Universal'
    ];

    const productCategories = ['Informática', 'Móveis', 'Eletrônicos', 'Acessórios', 'Telecomunicações'];

    const products = [];
    for (let i = 0; i < 20; i++) {
      const product = {
        productName: productNames[i],
        category: productCategories[Math.floor(Math.random() * productCategories.length)],
        price: Math.floor(Math.random() * 50000) + 1000, // Preço entre 1000 e 51000
        quantity: Math.floor(Math.random() * 100) + 5, // Quantidade entre 5 e 105
        description: `Descrição detalhada do produto ${productNames[i]}`,
        status: ['ativo', 'ativo', 'ativo', 'inativo'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000)
      };
      products.push(product);
    }

    await Product.insertMany(products);
    console.log('✅ 20 produtos criados');

    console.log('\n🎉 Seed básico concluído com sucesso!');
    console.log('📊 Dados criados:');
    console.log(`   • 20 Clientes`);
    console.log(`   • 20 Fornecedores`);
    console.log(`   • 20 Produtos`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexão com MongoDB fechada');
  }
};

// Executar o seed
connectDB().then(() => {
  seedData();
});
