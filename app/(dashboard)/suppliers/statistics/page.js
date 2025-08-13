import SuppliersDashboardAnalytics from '../../../../components/SuppliersDashboardAnalytics';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import connectToDB from '../../../../utils/DAO';
import User from '../../../../models/userModel';
import Supplier from '../../../../models/supplierModel';

async function getSupplierData(empresaId) {
  try {
    await connectToDB();
    
    const suppliers = await Supplier.find({ empresaId }).sort({ createdAt: -1 });
    
    // Serializando os dados para evitar problemas com ObjectId
    return JSON.parse(JSON.stringify(suppliers));
  } catch (error) {
    console.error('Erro ao buscar dados de fornecedores:', error);
    return [];
  }
}

export default async function SuppliersStatistics() {
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

  // Buscar dados dos fornecedores
  const suppliers = await getSupplierData(user.empresaId);

  return (
    <div className="p-6">
      <SuppliersDashboardAnalytics suppliers={suppliers} />
    </div>
  );
}