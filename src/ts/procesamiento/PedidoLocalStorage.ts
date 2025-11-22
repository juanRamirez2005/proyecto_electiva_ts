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
  pedido?: {
    producto: string;
    personalizacion: string;
    extras: string[];
    de: string;
    para: string;
    mensajeTarjeta: string;
    fechaEntrega: string;
    horaEntrega: string;
    isSorpresa: boolean;
    observacionesDespachador: string;
  };
  //TODO: validar estos atributos
  estado?: string;
  precio?: string;
  hora?: string;
  fecha_creacion?: string;
}