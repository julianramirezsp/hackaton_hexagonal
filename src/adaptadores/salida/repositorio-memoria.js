export function crearRepositorioMemoria() {
  const evaluaciones = new Map();

  const calcularSiguienteId = () => {
    let maxId = 0;
    for (const id of evaluaciones.keys()) {
      if (id > maxId) maxId = id;
    }
    return maxId + 1;
  };

  return {
    listar() {
      // Retorna copias de cada elemento
      return Array.from(evaluaciones.values()).map((e) => ({ ...e }));
    },

    obtener(id) {
      const evaluacion = evaluaciones.get(Number(id));
      // Devuelve undefined si no existe, o una copia si existe
      return evaluacion ? { ...evaluacion } : undefined;
    },

    guardar(evaluacion) {
      const copy = { ...evaluacion };
      if (copy.id === undefined || copy.id === null) {
        copy.id = calcularSiguienteId();
      } else {
        copy.id = Number(copy.id);
      }

      evaluaciones.set(copy.id, { ...copy });
      return { ...copy };
    },

    eliminar(id) {
      const idNum = Number(id);
      if (!evaluaciones.has(idNum)) {
        return false;
      }
      return evaluaciones.delete(idNum);
    }
  };
}