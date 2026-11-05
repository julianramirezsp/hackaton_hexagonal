import { CODIGOS, ErrorDeDominio } from '../dominio/evaluacion.js';
import * as Evaluacion from '../dominio/evaluacion.js';

export function crearCasosDeUso({ repositorio }) {
  // Función auxiliar para buscar una evaluación o lanzar error de dominio
  const buscar = (id) => {
    const evaluacion = repositorio.obtener(id);
    if (!evaluacion) {
      throw new ErrorDeDominio(
        CODIGOS.NO_EXISTE,
        `No existe evaluación con id ${id}`
      );
    }
    return evaluacion;
  };

  return {
    /** Todas las evaluaciones. */
    listar() {
      return repositorio.listar();
    },

    /** Una evaluación por id. Si no existe: ErrorDeDominio con CODIGOS.NO_EXISTE. */
    ver(id) {
      return buscar(id);
    },

    /** Crea una evaluación: el dominio valida con las que ya existen y el repositorio la guarda. */
    crear(datos) {
      const nuevaEvaluacion = Evaluacion.crear(datos, repositorio.listar());
      return repositorio.guardar(nuevaEvaluacion);
    },

    /** Le pone nota a una evaluación: busca, el dominio califica y el repositorio guarda. */
    calificar(id, nota) {
      const evaluacion = buscar(id);
      const evaluacionCalificada = Evaluacion.calificar(evaluacion, nota);
      return repositorio.guardar(evaluacionCalificada);
    },

    /** Elimina una evaluación. Si no existe: NO_EXISTE. */
    eliminar(id) {
      buscar(id);
      return repositorio.eliminar(id);
    },

    /** El resumen del semestre: lo calcula el dominio con todas las evaluaciones. */
    resumen() {
      return Evaluacion.resumen(repositorio.listar());
    },
  };
}