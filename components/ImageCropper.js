'use client';
import { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ASPECT_RATIOS = {
  logo: 1, // quadrado
  cover: 16 / 9 // widescreen
};

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper({ 
  image, 
  type, 
  onCropComplete, 
  onCancel,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.8
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const aspect = ASPECT_RATIOS[type];
    setCrop(centerAspectCrop(width, height, aspect));
  }

  async function handleComplete() {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calcular dimensões mantendo proporção e respeitando máximos
    let targetWidth = completedCrop.width * scaleX;
    let targetHeight = completedCrop.height * scaleY;

    if (targetWidth > maxWidth) {
      const ratio = maxWidth / targetWidth;
      targetWidth = maxWidth;
      targetHeight = targetHeight * ratio;
    }

    if (targetHeight > maxHeight) {
      const ratio = maxHeight / targetHeight;
      targetHeight = maxHeight;
      targetWidth = targetWidth * ratio;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Converter para WebP se suportado
    const mimeType = 'image/webp';
    let blob;
    
    try {
      blob = await new Promise(resolve => {
        canvas.toBlob(
          resolve,
          mimeType,
          quality
        );
      });
    } catch (err) {
      // Fallback para JPEG se WebP não for suportado
      blob = await new Promise(resolve => {
        canvas.toBlob(
          resolve,
          'image/jpeg',
          quality
        );
      });
    }

    const croppedFile = new File([blob], 'cropped-image.webp', {
      type: blob.type,
    });

    onCropComplete(croppedFile);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
        <h3 className="text-lg font-semibold mb-4">
          Ajustar Imagem
        </h3>

        <div className="relative max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT_RATIOS[type]}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              alt="Imagem para cortar"
              src={image}
              onLoad={onImageLoad}
              className="max-w-full"
            />
          </ReactCrop>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
