'use client';
import { useState } from 'react';
import Image from 'next/image';
import ImageCropper from './ImageCropper';

export default function ImageUploadField({ 
  type, 
  empresaId, 
  currentImage, 
  onUploadSuccess,
  onRemove,
  className = ""
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [cropImage, setCropImage] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('A imagem deve ter no máximo 10MB.');
      return;
    }

    // Converter para objeto URL para preview
    const imageUrl = URL.createObjectURL(file);
    setCropImage(imageUrl);
  };

  const handleCropComplete = async (croppedFile) => {
    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append('file', croppedFile);
      formData.append('type', type);
      formData.append('empresaId', empresaId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer upload da imagem');
      }

      const imageData = await response.json();
      onUploadSuccess(imageData);

    } catch (err) {
      setError(err.message || 'Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
      setCropImage(null);
    }
  };

  const handleRemove = async () => {
    if (!currentImage?.url || !onRemove) return;
    
    try {
      setIsUploading(true);
      await onRemove();
    } catch (err) {
      setError('Erro ao remover a imagem');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        border-2 border-dashed rounded-lg p-4 text-center
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}
        transition-colors cursor-pointer
      `}>
        {currentImage?.url ? (
          <div className="relative w-full aspect-video group">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || 'Imagem carregada'}
              fill
              className="object-contain"
            />
            {onRemove && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="py-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              {type === 'logo' ? 'Upload do logotipo' : 'Upload da imagem de capa'}
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {cropImage && (
        <ImageCropper
          image={cropImage}
          type={type}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            URL.revokeObjectURL(cropImage);
            setCropImage(null);
          }}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
