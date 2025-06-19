import { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from './credenciales/cloudinaryConfig';

// returna link del archivo subido a la nube
export const subirImagenALaNube = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error('Cloudinary error:', data);
      throw new Error('No se pudo subir la imagen.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};


