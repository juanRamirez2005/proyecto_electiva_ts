import { Adicional } from "./Adicional.js";
export class Pedido {
    constructor(producto, personalizacion, extras, de, para, mensajeTarjeta, fechaEntrega, horaEntrega, isSorpresa, observacionesDespachador) {
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
