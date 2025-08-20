import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

export async function uploadToCloudinary(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      public_id: fileName,
      folder: 'sos-uploads',
      resource_type: 'image',
    }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(fileBuffer);
  });
}
