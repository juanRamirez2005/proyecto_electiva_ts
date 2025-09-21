import { Adicional } from "./Adicional";

export class Pedido {
    producto: string;
    personalizacion: string;
    extras: string[];
    de: string;
    para: string;
    mensajeTarjeta: string;
    fechaEntrega: Date;
    horaEntrega: Date;
    isSorpresa: boolean;
    observacionesDespachador: string;

    constructor(
        producto: string,
        personalizacion: string,
        extras: string[],
        de: string,
        para: string,
        mensajeTarjeta: string,
        fechaEntrega: Date,
        horaEntrega: Date,
        isSorpresa: boolean,
        observacionesDespachador: string
    ) {
        this.producto = producto;
        this.personalizacion = personalizacion;
        this.extras = extras;
        this.de = de;
        this.para = para;
        this.mensajeTarjeta = mensajeTarjeta;
        this.fechaEntrega = fechaEntrega;
        this.horaEntrega = horaEntrega;
        this.isSorpresa = isSorpresa;
        this.observacionesDespachador = observacionesDespachador;
    }
}