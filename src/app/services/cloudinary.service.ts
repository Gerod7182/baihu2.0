import { Injectable } from '@angular/core';

const CLOUD_NAME = 'vprc5qut';
const UPLOAD_PRESET = 'baihuart_app';
const TRANSFORMACION = 'f_auto,q_auto,c_limit,w_1200';
const TAMANO_MAXIMO_MB = 10;

@Injectable({ providedIn: 'root' })
export class CloudinaryService {

  // POST multipart a Cloudinary. Devuelve la URL https optimizada de la imagen.
  async subirImagen(archivo: File): Promise<string> {
    if (!archivo.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen.');
    }
    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      throw new Error(`La imagen pesa más de ${TAMANO_MAXIMO_MB} MB.`);
    }

    const datos = new FormData();
    datos.append('file', archivo);
    datos.append('upload_preset', UPLOAD_PRESET);

    const respuesta = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: datos }
    );

    if (!respuesta.ok) {
      throw new Error('No se pudo subir la imagen. Intenta de nuevo.');
    }

    const json = await respuesta.json();

    // Pide a Cloudinary formato y calidad automáticos, y máximo 1200 px de ancho
    return (json.secure_url as string).replace('/upload/', `/upload/${TRANSFORMACION}/`);
  }
}