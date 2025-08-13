// Script simples para criar usuário via API
async function createUser() {
  const empresa = {
    nome: 'Empresa Teste',
    razaoSocial: 'Empresa Teste Ltda',
    email: 'contato@empresateste.com',
    telefone: '+258 84 123 4567',
    endereco: 'Maputo, Moçambique',
    cnpj: '123456789'
  };

  const user = {
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@teste.com',
    password: 'admin123',
    role: 'admin'
  };

  try {
    // Criar empresa primeiro
    console.log('Criando empresa...');
    const empresaRes = await fetch('http://localhost:3001/api/empresas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empresa)
    });
    
    if (empresaRes.ok) {
      const empresaData = await empresaRes.json();
      console.log('Empresa criada:', empresaData);
      
      // Adicionar empresaId ao usuário
      user.empresaId = empresaData.empresa?._id;
      
      // Criar usuário
      console.log('Criando usuário...');
      const userRes = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        console.log('Usuário criado:', userData);
        console.log('\n=== LOGIN CRIADO ===');
        console.log('Email: admin@teste.com');
        console.log('Senha: admin123');
      } else {
        const error = await userRes.text();
        console.error('Erro ao criar usuário:', error);
      }
    } else {
      const error = await empresaRes.text();
      console.error('Erro ao criar empresa:', error);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

createUser();
