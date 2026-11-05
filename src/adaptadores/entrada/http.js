import { createServer } from 'node:http';
import { CODIGOS, ErrorDeDominio } from '../../dominio/evaluacion.js';
import { ErrorHttp, crearManejador } from './nucleo-http.mjs';

const ESTADO_POR_CODIGO = {
  [CODIGOS.NOMBRE_INVALIDO]: 422,
  [CODIGOS.PESO_INVALIDO]: 422,
  [CODIGOS.NOTA_INVALIDA]: 422,
  [CODIGOS.NOMBRE_REPETIDO]: 409,
  [CODIGOS.PESO_EXCEDIDO]: 409,
  [CODIGOS.NO_EXISTE]: 404,
};

export function traducirError(error) {
  if (error instanceof ErrorDeDominio && ESTADO_POR_CODIGO[error.codigo]) {
    return new ErrorHttp(ESTADO_POR_CODIGO[error.codigo], error.message, { titulo: error.codigo });
  }
  return error; // lo desconocido el núcleo lo convierte en 500
}

export function crearRutas(casos) {
  return [
    { metodo: 'GET', ruta: '/salud', manejador: () => ({ status: 200, cuerpo: { estado: 'ok' } }) },
    { metodo: 'GET', ruta: '/resumen', manejador: () => ({ status: 200, cuerpo: casos.resumen() }) },
    { metodo: 'GET', ruta: '/evaluaciones', manejador: () => ({ status: 200, cuerpo: casos.listar() }) },
    {
      metodo: 'POST',
      ruta: '/evaluaciones',
      manejador: ({ cuerpo }) => {
        const creada = casos.crear(cuerpo);
        return { status: 201, cuerpo: creada, cabeceras: { Location: '/evaluaciones/' + creada.id } };
      },
    },
    {
      metodo: 'GET',
      ruta: '/evaluaciones/{id}',
      manejador: ({ params }) => ({ status: 200, cuerpo: casos.ver(Number(params.id)) }),
    },
    {
      metodo: 'PATCH',
      ruta: '/evaluaciones/{id}',
      manejador: ({ params, cuerpo }) => ({ status: 200, cuerpo: casos.calificar(Number(params.id), cuerpo.nota) }),
    },
    {
      metodo: 'DELETE',
      ruta: '/evaluaciones/{id}',
      manejador: ({ params }) => {
        casos.eliminar(Number(params.id));
        return { status: 204 };
      },
    },
  ];
}

export function crearApi(casos) {
  return createServer(
    crearManejador({
      rutas: crearRutas(casos),
      traducirError,
    }),
  );
}