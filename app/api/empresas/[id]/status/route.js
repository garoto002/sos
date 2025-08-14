"use server";
import dbConnect from "@/utils/dbConnect";
import Empresa from "@/models/empresaModel";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await request.json();
    
    if (!['active', 'inactive'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Status inválido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const empresa = await Empresa.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!empresa) {
      return new Response(JSON.stringify({ error: 'Empresa não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(empresa), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
