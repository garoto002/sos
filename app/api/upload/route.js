import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { empresaModel } from '@/models/empresaModel';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Certifica que o diretório de upload existe
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Configurações de redimensionamento por tipo
const RESIZE_CONFIG = {
  logo: {
    width: 400,
    height: 400,
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  },
  cover: {
    width: 1200,
    height: 675,
    fit: 'cover'
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');
    const empresaId = formData.get('empresaId');

    if (!file || !type || !empresaId) {
      return NextResponse.json(
        { error: 'Arquivo, tipo e ID da empresa são obrigatórios' },
        { status: 400 }
      );
    }

    await ensureUploadDir();

    // Converter o arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Processar a imagem com Sharp
    const config = RESIZE_CONFIG[type];
    if (!config) {
      return NextResponse.json(
        { error: 'Tipo de imagem inválido' },
        { status: 400 }
      );
    }

    const fileName = `${type}-${nanoid()}.webp`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    // Processar e salvar a imagem
    await sharp(buffer)
      .resize(config)
      .webp({ quality: 80 })
      .toFile(filePath);

    // Atualizar o campo apropriado no modelo da empresa
    const empresa = await empresaModel.findById(empresaId);
    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    // Se já existir uma imagem antiga, remover
    if (empresa[type]?.path) {
      const oldPath = path.join(process.cwd(), 'public', empresa[type].path);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.error('Erro ao remover imagem antiga:', err);
      }
    }

    // Atualizar o caminho da imagem no banco de dados
    empresa[type] = {
      url: `/uploads/${fileName}`,
      path: `/uploads/${fileName}`,
      alt: `${empresa.nome} - ${type === 'logo' ? 'Logotipo' : 'Imagem de capa'}`
    };

    await empresa.save();

    return NextResponse.json(empresa[type]);

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload' },
      { status: 500 }
    );
  }
}

// Método DELETE para remover imagens
export async function DELETE(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const empresaId = searchParams.get('empresaId');
    const type = searchParams.get('type');

    if (!empresaId || !type) {
      return NextResponse.json(
        { error: 'ID da empresa e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    const empresa = await empresaModel.findById(empresaId);
    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    // Se existir uma imagem, remover o arquivo
    if (empresa[type]?.path) {
      const filePath = path.join(process.cwd(), 'public', empresa[type].path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Erro ao remover arquivo:', err);
      }
    }

    // Remover referência no banco de dados
    empresa[type] = null;
    await empresa.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao remover a imagem' },
      { status: 500 }
    );
  }
}
