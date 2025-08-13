// Script para criar um super admin diretamente no banco via API ou seed
// Ajuste conforme seu backend (exemplo: POST direto na API ou seed MongoDB)

async function createSuperAdmin() {
  const user = {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@sistema.com',
    password: 'admin123',
    role: 'superadmin',
    empresaId: null // ou um ID especial, se necessário
  };

  try {
    const res = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (res.ok) {
      const result = await res.json();
      console.log('Super admin criado com sucesso!', result);
    } else {
      const err = await res.text();
      console.error('Erro ao criar super admin:', err);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

createSuperAdmin();
