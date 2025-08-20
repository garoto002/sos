import { NextResponse } from "next/server";
import Pessoa from "@/models/pessoaModel";
import connectToDB from "@/utils/DAO";
import { uploadToCloudinary } from "@/utils/cloudinary";

export async function GET(request) {
  try {
    await connectToDB();
    const pessoas = await Pessoa.find();
    return NextResponse.json({ pessoas });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Erro ao buscar pessoas" }, { status: 500 });
  }
}

export async function POST(request) {
  // Detecta se é form-data (upload de arquivo)
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const nome = formData.get("nome");
    const descricao = formData.get("descricao");
    const status = formData.get("status");
    const ultimoLocal = formData.get("ultimoLocal");
    const roupa = formData.get("roupa");
    const contacto = formData.get("contacto");
    const fotoFile = formData.get("foto");

    if (!nome || !status || !fotoFile || typeof fotoFile === "string") {
      return NextResponse.json({ error: "Nome, status e foto obrigatórios" }, { status: 400 });
    }

    // Upload para Cloudinary
    const ext = fotoFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const buffer = Buffer.from(await fotoFile.arrayBuffer());
    let foto = "";
    try {
      const result = await uploadToCloudinary(buffer, fileName);
      foto = result.secure_url;
    } catch (err) {
      return NextResponse.json({ error: "Erro ao enviar imagem para Cloudinary" }, { status: 500 });
    }

    try {
      await connectToDB();
      const pessoa = await Pessoa.create({ nome, descricao, foto, status, ultimoLocal, roupa, contacto });
      return NextResponse.json({ pessoa });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: "Erro ao cadastrar pessoa" }, { status: 500 });
    }
  } else {
    // JSON tradicional (mantém compatibilidade)
    const body = await request.json();
    const { nome, descricao, foto, status, ultimoLocal, roupa, contacto } = body;
    if (!nome || !status || !foto) {
      return NextResponse.json({ error: "Nome, status e foto obrigatórios" }, { status: 400 });
    }
    try {
      await connectToDB();
      const pessoa = await Pessoa.create({ nome, descricao, foto, status, ultimoLocal, roupa, contacto });
      return NextResponse.json({ pessoa });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: "Erro ao cadastrar pessoa" }, { status: 500 });
    }
  }
}
