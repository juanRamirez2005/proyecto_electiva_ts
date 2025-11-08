export class Tarjeta {
    constructor(nombrePara, nombreDe, mensaje) {
        this.nombrePara = nombrePara;
        this.nombreDe = nombreDe;
        this.mensaje = mensaje;
    }
    getNombrePara() {
        return this.nombrePara;
    }
    getNombreDe() {
        return this.nombreDe;
    }
    getMensaje() {
        return this.mensaje;
    }
    setMensaje(mensaje) {
        this.mensaje = mensaje;
    }
    setNombrePara(nombrePara) {
        this.nombrePara = nombrePara;
    }
    setNombreDe(nombreDe) {
        this.nombreDe = nombreDe;
    }
}
