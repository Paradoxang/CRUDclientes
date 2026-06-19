export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fechaNacimiento: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface ClienteInput {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fechaNacimiento: string;
  activo: boolean;
}

export interface ResultadoPaginado<T> {
  datos: T[];
  pagina: number;
  tamanoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
}