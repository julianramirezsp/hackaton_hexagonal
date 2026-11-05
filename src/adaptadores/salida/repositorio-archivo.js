import fs from 'node:fs';
import path from 'node:path';

export function crearRepositorioArchivo(rutaArchivo = 'datos/evaluaciones.json') {
  const rutaAbsoluta = path.resolve(rutaArchivo);

  // Carga los datos sin crear el archivo si no existe
  const cargarDatos = () => {
    try {
      if (!fs.existsSync(rutaAbsoluta)) {
        return [];
      }
      const contenido = fs.readFileSync(rutaAbsoluta, 'utf-8');
      return JSON.parse(contenido || '[]');
    } catch {
      return [];
    }
  };

  // Solo al guardar se crea la carpeta y el archivo
  const guardarDatos = (datos) => {
    const directorio = path.dirname(rutaAbsoluta);
    if (!fs.existsSync(directorio)) {
      fs.mkdirSync(directorio, { recursive: true });
    }
    fs.writeFileSync(rutaAbsoluta, JSON.stringify(datos, null, 2), 'utf-8');
  };

  return {
    listar() {
      // Devuelve copias de cada elemento
      return cargarDatos().map((e) => ({ ...e }));
    },

    obtener(id) {
      const datos = cargarDatos();
      const evaluacion = datos.find((e) => Number(e.id) === Number(id));
      // Devuelve undefined si no existe, o una copia si existe
      return evaluacion ? { ...evaluacion } : undefined;
    },

    guardar(evaluacion) {
      const datos = cargarDatos();
      const copy = { ...evaluacion };

      if (copy.id === undefined || copy.id === null) {
        const maxId = datos.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
        copy.id = maxId + 1;
      } else {
        copy.id = Number(copy.id);
      }

      const indice = datos.findIndex((e) => Number(e.id) === copy.id);

      if (indice >= 0) {
        datos[indice] = { ...copy };
      } else {
        datos.push({ ...copy });
      }

      guardarDatos(datos);
      return { ...copy };
    },

    eliminar(id) {
      const datos = cargarDatos();
      const idNum = Number(id);
      const nuevosDatos = datos.filter((e) => Number(e.id) !== idNum);

      if (nuevosDatos.length === datos.length) {
        return false;
      }

      guardarDatos(nuevosDatos);
      return true;
    }
  };
}