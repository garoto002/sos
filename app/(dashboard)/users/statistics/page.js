import UsersDashboardAnalytics from '../../../../components/UsersDashboardAnalytics';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import connectToDB from '../../../../utils/DAO';
import User from '../../../../models/userModel';

async function getUserData(empresaId) {
  try {
    await connectToDB();
    
    const users = await User.find({ empresaId }).sort({ createdAt: -1 });
    
    // Serializando os dados para evitar problemas com ObjectId
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao buscar dados de usuários:', error);
    return [];
  }
}

export default async function UsersStatistics() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Buscar empresa do usuário
  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Buscar dados dos usuários
  const users = await getUserData(user.empresaId);

  return (
    <div className="p-6">
      <UsersDashboardAnalytics users={users} />
    </div>
  );
}
