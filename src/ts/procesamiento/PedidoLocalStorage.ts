export interface PedidoLocalStorage {
  key?: string;
  id?: string;
  cliente?: {
    nombre: string;
    telefono: string;
  };
  destinatario?: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
  producto?: string;
  personalizacion?: string;
  extras?: string[];
  hora?: string;
  fechaEntrega?: string;
  isSorpresa?: boolean;
  observaciones?: string;
  //TODO: validar estos atributos
  estado?: string;
  precio?: string;
  fecha_creacion?: string;
}