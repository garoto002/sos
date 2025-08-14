"use server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/userModel";

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

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(user), {
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
