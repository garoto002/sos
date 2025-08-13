const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

// Schemas (simplificados para o script)
const empresaSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  nuit: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const customerSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  location: String,
  address: String,
  phone: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
  nuit: Number,
  category: String,
  status: { type: String, enum: ['ativo', 'inativo', 'pendente'], default: 'ativo' },
  notes: String,
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const saleSchema = new mongoose.Schema({
  customer: String,
  items: [{
    productName: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  total: Number,
  status: { type: String, enum: ['pendente', 'concluida', 'cancelada'], default: 'pendente' },
  paymentMethod: String,
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const purchaseSchema = new mongoose.Schema({
  supplier: String,
  items: [{
    productName: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  total: Number,
  status: { type: String, enum: ['pendente', 'concluida', 'cancelada'], default: 'pendente' },
  paymentMethod: String,
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const Empresa = mongoose.model('Empresa', empresaSchema);
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const Product = mongoose.model('Product', productSchema);
const Sale = mongoose.model('Sale', saleSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed dos dados...');

    // Limpar dados existentes (opcional)
    // await Promise.all([
    //   User.deleteMany({}),
    //   Customer.deleteMany({}),
    //   Supplier.deleteMany({}),
    //   Product.deleteMany({}),
    //   Sale.deleteMany({}),
    //   Purchase.deleteMany({})
    // ]);

    // 1. Criar empresa exemplo (se não existir)
    let empresa = await Empresa.findOne({ email: 'empresa@exemplo.com' });
    if (!empresa) {
      empresa = await Empresa.create({
        name: 'Empresa Exemplo Lda',
        email: 'empresa@exemplo.com',
        phone: '+258 84 123 4567',
        address: 'Av. Julius Nyerere, Maputo',
        nuit: 400123456
      });
      console.log('✅ Empresa criada');
    }

    // 2. Criar usuários de diferentes níveis
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const users = [
      {
        name: 'Admin Principal',
        email: 'admin@exemplo.com',
        password: hashedPassword,
        role: 'admin',
        empresaId: empresa._id
      },
      {
        name: 'Gestor Vendas',
        email: 'gestor@exemplo.com',
        password: hashedPassword,
        role: 'manager',
        empresaId: empresa._id
      },
      {
        name: 'Vendedor João',
        email: 'joao@exemplo.com',
        password: hashedPassword,
        role: 'user',
        empresaId: empresa._id
      },
      {
        name: 'Vendedora Maria',
        email: 'maria@exemplo.com',
        password: hashedPassword,
        role: 'user',
        empresaId: empresa._id
      },
      {
        name: 'Gestor Compras',
        email: 'compras@exemplo.com',
        password: hashedPassword,
        role: 'manager',
        empresaId: empresa._id
      }
    ];

    let createdUsers = [];
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push(user);
      } else {
        createdUsers.push(existingUser);
      }
    }
    console.log('✅ Usuários criados/verificados');

    const adminUser = createdUsers[0];

    // 3. Criar 20 clientes
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
        user: adminUser._id,
        empresaId: empresa._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      };
      customers.push(customer);
    }

    await Customer.insertMany(customers);
    console.log('✅ 20 clientes criados');

    // 4. Criar 20 fornecedores
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
        user: adminUser._id,
        empresaId: empresa._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000)
      };
      suppliers.push(supplier);
    }

    await Supplier.insertMany(suppliers);
    console.log('✅ 20 fornecedores criados');

    // 5. Criar 20 produtos
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
        user: adminUser._id,
        empresaId: empresa._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000)
      };
      products.push(product);
    }

    await Product.insertMany(products);
    console.log('✅ 20 produtos criados');

    const createdProducts = await Product.find({ empresaId: empresa._id });
    const createdCustomers = await Customer.find({ empresaId: empresa._id });

    // 6. Criar 20 vendas
    const paymentMethods = ['Dinheiro', 'Cartão', 'Transferência', 'Cheque'];
    const saleStatuses = ['concluida', 'concluida', 'concluida', 'pendente', 'cancelada'];

    const sales = [];
    for (let i = 0; i < 20; i++) {
      const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1 a 3 itens por venda
      const items = [];
      let saleTotal = 0;

      for (let j = 0; j < numItems; j++) {
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const itemTotal = randomProduct.price * quantity;
        
        items.push({
          productName: randomProduct.productName,
          quantity: quantity,
          price: randomProduct.price,
          total: itemTotal
        });
        
        saleTotal += itemTotal;
      }

      const sale = {
        customer: randomCustomer.customerName,
        items: items,
        total: saleTotal,
        status: saleStatuses[Math.floor(Math.random() * saleStatuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        notes: i % 5 === 0 ? 'Venda com desconto especial' : '',
        user: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
        empresaId: empresa._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      };
      sales.push(sale);
    }

    await Sale.insertMany(sales);
    console.log('✅ 20 vendas criadas');

    // 7. Criar 20 compras
    const createdSuppliers = await Supplier.find({ empresaId: empresa._id });
    const purchaseStatuses = ['concluida', 'concluida', 'pendente', 'cancelada'];

    const purchases = [];
    for (let i = 0; i < 20; i++) {
      const randomSupplier = createdSuppliers[Math.floor(Math.random() * createdSuppliers.length)];
      const numItems = Math.floor(Math.random() * 4) + 1; // 1 a 4 itens por compra
      const items = [];
      let purchaseTotal = 0;

      for (let j = 0; j < numItems; j++) {
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 20) + 5; // Compras maiores que vendas
        const purchasePrice = randomProduct.price * 0.7; // Preço de compra menor que venda
        const itemTotal = purchasePrice * quantity;
        
        items.push({
          productName: randomProduct.productName,
          quantity: quantity,
          price: purchasePrice,
          total: itemTotal
        });
        
        purchaseTotal += itemTotal;
      }

      const purchase = {
        supplier: randomSupplier.company,
        items: items,
        total: purchaseTotal,
        status: purchaseStatuses[Math.floor(Math.random() * purchaseStatuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        notes: i % 4 === 0 ? 'Compra em lote' : '',
        user: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
        empresaId: empresa._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000)
      };
      purchases.push(purchase);
    }

    await Purchase.insertMany(purchases);
    console.log('✅ 20 compras criadas');

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('📊 Dados criados:');
    console.log(`   • 1 Empresa`);
    console.log(`   • 5 Usuários (diferentes níveis)`);
    console.log(`   • 20 Clientes`);
    console.log(`   • 20 Fornecedores`);
    console.log(`   • 20 Produtos`);
    console.log(`   • 20 Vendas`);
    console.log(`   • 20 Compras`);
    console.log('\n📝 Usuários de teste:');
    console.log('   admin@exemplo.com / 123456 (Admin)');
    console.log('   gestor@exemplo.com / 123456 (Manager)');
    console.log('   joao@exemplo.com / 123456 (User)');
    console.log('   maria@exemplo.com / 123456 (User)');
    console.log('   compras@exemplo.com / 123456 (Manager)');

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
