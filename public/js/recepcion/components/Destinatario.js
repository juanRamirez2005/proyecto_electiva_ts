import { Cliente } from "./Cliente";
export class Destinatario extends Cliente {
    constructor(nombre, telefono, direccion) {
        super(nombre, telefono);
        this.direccion = direccion;
    }
    getDireccion() {
        return this.direccion;
    }
}
